# How to use?

Make sure you have Node 16 installed

1. install deps: `npm i`
2. run `npm start "FILE_NAME" "ENTRY_NODE" "RELATION_1" "RELATION_2" ...`

`FILE_NAME` - CVS filename containing dataset or format "source", "target", "edge"
`ENTRY_NODE` - The node you want you question to start asking on, ie: "national recording registry"
"RELATION_X" - A zero or many relations we want to follow (don't forget to put in quotes!)

For example: `npm start "s_t_e_wiki_sent_2 - s_t_e_wiki_sent_2.csv" "cameras" "is" "planned"`
For answering questions such as: "Who supervised the thing that was added to the national recording registry?"

We could run: `npm start "s_t_e_wiki_sent_2 - s_t_e_wiki_sent_2.csv" "national recording registry" "added to" "supervised"`

# About my solution

The solution uses a simple backtracking (with unoptimized recursion in js) to find all possible paths of a "graph"
built based on the CVS implemented using a dictionary. The keys are relations and values are lists of nodes connected by this relation.

A proper graph could have given us better results as finding "relations" would be in O(1) and not O(N) (In my code I use .filter() to find possible paths)
