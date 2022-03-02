const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const { argv } = require("process");

function buildGraph(file) {
  return new Promise((res, rej) => {
    const graph = {};
    fs.createReadStream(path.resolve(__dirname, file))
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        // error reading csv
        rej(error);
      })
      .on("data", (row) => {
        rel = graph[row.edge];
        pair = { source: row.source, target: row.target };
        if (!rel) {
          // first relation find of type "edge"
          graph[row.edge] = [pair];
        } else {
          // relations can have more than one pair
          rel.push(pair);
        }
      })
      .on("end", () => res(graph));
  });
}

function askQuestion(graph, entry, relations = []) {
  if (!relations.length) {
    // we got to the root, if we got here, this means we reached the source
    // therefore, this is the answer :)
    return entry;
  }
  const currNode = entry;
  const cloneRelations = relations.slice();
  const currRel = cloneRelations.shift();
  const optionalNodes = graph[currRel];

  // we reached a dead end and cannot keep traversing.
  if (!optionalNodes) {
    return;
  }
  // note: its possible to have a relation with the same target but different source, we must follow
  // all permutations and see if this leads us to a single solution
  const optionalSources = optionalNodes.filter(
    (node) => node.target === currNode
  );

  for (const { source } of optionalSources) {
    const node = askQuestion(graph, source, cloneRelations);
    if (node) {
      // if the recursion found a node, this means it contains a valid path.
      return node;
    }

    // no nodes were found, this means that the path was a dead end, and no edge exists.
    continue;
  }
}

async function ask(file, entry, relations) {
  const graph = await buildGraph(file);
  const answer = askQuestion(graph, entry, relations);

  // only printing since no top-level await can print it directly from main.
  if (!answer) {
    console.log(
      "unfortunatly we can't answer your questions with this dataset :("
    );

    return;
  }

  console.log("answer:", answer);
  return answer;
}

// Note: needs top-level await support.
ask(argv[2], argv[3], argv.slice(4));
