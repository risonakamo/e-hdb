#combine txt info file into rawdata file
#requires a links.txt (containing 1 url per line)
#meta.txt (containing name,type,tags,and a dash)
#ilinks.txt (containing thumbnail link per line)
#might need new lines at end

def main():
    links=open("links.txt");
    meta=open("meta.txt");
    ilinks=open("ilinks.txt");

    res="";

    for x in links:
        res+=meta.readline();
        res+=meta.readline();
        res+=ilinks.readline();
        res+=x;
        res+=meta.readline();
        res+="-\n";
        meta.readline();

    print(res);

if __name__=="__main__":
    main();