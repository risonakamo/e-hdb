#include remote;
#include shell;
#include Menu;
#include MenuItem;
#include datastore;

datastore db;
int curId;
string-array allTags;
string-array allTypes;

void main();

void opBox();

void getBoxes(array data);

void parseRaw();

void boxEvents();

void loadAll();

void shuffle();

void arrayPick(array array,int size);

void getDbMeta();

void loadQuery(string query);