def rag_to_wfg(rag):
    wfg = {}
    for process, edges in rag.items():
        wfg[process] = [res for res in edges if res.startswith("P")]
    return wfg
