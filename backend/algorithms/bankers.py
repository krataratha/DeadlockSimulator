def is_safe_state(available, max_demand, allocation):
    n = len(max_demand)
    m = len(available)
    work = available[:]
    finish = [False] * n
    need = [[max_demand[i][j] - allocation[i][j] for j in range(m)] for i in range(n)]

    safe_sequence = []

    while len(safe_sequence) < n:
        allocated = False
        for i in range(n):
            if not finish[i] and all(need[i][j] <= work[j] for j in range(m)):
                for j in range(m):
                    work[j] += allocation[i][j]
                finish[i] = True
                safe_sequence.append(i)
                allocated = True
                break
        if not allocated:
            return False, []
    return True, safe_sequence
