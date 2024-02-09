#!/usr/bin/env python3
import sys

"""checks if its safe"""


def is_safe(board, row, col, n):
    """checks if its safe"""
    for i in range(col):
        if board[row][i] == 1:
            return False

    for i, j in zip(range(row, -1, -1), range(col, -1, -1)):
        if board[i][j] == 1:
            return False

    for i, j in zip(range(row, n, 1), range(col, -1, -1)):
        if board[i][j] == 1:
            return False

    return True


"""solves the problem utilization"""


def solve_nqueens_util(board, col, n):
    """solves the problem utilization"""
    if col == n:
        print_solution(board, n)
        return True

    res = False
    for i in range(n):
        if is_safe(board, i, col, n):
            board[i][col] = 1

            res = solve_nqueens_util(board, col + 1, n) or res

            board[i][col] = 0
    return res


"""solves the nqueens problem"""


def solve_nqueens(n):
    """solves the nqueens problem """
    if not isinstance(n, int):
        print("N must be a number")
        sys.exit(1)

    if n < 4:
        print("N must be at least 4")
        sys.exit(1)

    board = [[0 for _ in range(n)] for _ in range(n)]

    if not solve_nqueens_util(board, 0, n):
        print(f"No solution for N = {n}")


"""printing function"""


def print_solution(board, n):
    """printing function"""
    solution = []
    for i in range(n):
        for j in range(n):
            if board[i][j] == 1:
                solution.append([i, j])
    print(solution)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: nqueens N")
        sys.exit(1)

    try:
        N = int(sys.argv[1])
        solve_nqueens(N)
    except ValueError:
        print("N must be a number")
        sys.exit(1)
