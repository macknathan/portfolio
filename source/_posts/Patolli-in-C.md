---
title: Patolli in C++
date: 2025-04-24 22:28:37
category: Problem-Solving
tags:
    - Programming
    - C++
---

This project was the final assignment for my C++ programming course at Old Dominion University, where we were asked to recreate a text-based version of Patolli, a strategic Mesoamerican board game. The program is built entirely in C++ using object-oriented design with custom ADTs for the player, board, and referee. It handles everything from input validation and turn management to movement rules and win conditions.

What I’m most proud of is how this project showcases my problem-solving skills — translating a physical board game into structured logic, managing complex game state, and designing interactions between multiple components without any visual interface. The full source code is included below.

<div style="max-height: 400px; overflow-y: auto; font-size: 0.9em;">
```C++
#include <iostream>
#include <string>
#include <stdlib.h>
#include <time.h>

using namespace std;

// used for spacing in board
const string space = "              ";
const string bar = "-----";
const string midspace = "--------------";

class Player
{
    string name;
    int score;
    string pieces;

    public:
        // constructor
        Player(char t)
        {
            name = t;
            score = 0;
            pieces = (t == 'L') ? "ABCDEF" : "123456";
        } 
        // getters and setters
        void SetScore(int s) { score = s; }
        int GetScore() { return score; }
        string GetName() { return name; }
        string GetPieces() { return pieces; }
};

class Board
{
    // array of spaces on the board
    char board[60];

    public:
        // constructor
        Board()
        {
            for (int i = 0; i < 60; i++)
                board[i] = ' ';
        }
        // getters and setters
        void SetValue(int x, char v) { board[x] = v; }
        char GetValue(int x) { return board[x]; }
        // draws board with pieces
        void DrawBoard()
        {
            cout << space << bar << endl;
            cout << space << "|" << board[7] << "|" << board[8] << "|" << endl;
            cout << space << bar << endl;
            cout << space << "|" << board[6] << "|" << board[9] << "|" << endl;
            cout << space << bar << endl;
            cout << space << "|" << board[5] << "|" << board[10] << "|" << endl;
            cout << space << bar << endl;
            cout << space << "|" << board[4] << "|" << board[11] << "|" << endl;
            cout << space << bar << endl;
            cout << space << "|" << board[3] << "|" << board[12] << "|" << endl;
            cout << space << bar << endl;
            cout << space << "|" << board[2] << "|" << board[13] << "|" << endl;
            cout << space << bar << endl;
            cout << space << "|" << board[1] << "|" << board[14] << "|" << endl;
            cout << midspace << bar << midspace << endl;
            cout << "|" << board[53] << "|" << board[54] << "|" << board[55] << "|" << board[56]
                 << "|" << board[57] << "|" << board[58] << "|" << board[59] << "|" << board[0]
                 << "|" << board[15] << "|" << board[16] << "|" << board[17] << "|" << board[18]
                 << "|" << board[19] << "|" << board[20] << "|" << board[21] << "|" << board[22] << "|" << endl;
            cout << midspace << bar << midspace << endl;
            cout << "|" << board[52] << "|" << board[51] << "|" << board[50] << "|" << board[49]
                 << "|" << board[48] << "|" << board[47] << "|" << board[46] << "|" << board[45]
                 << "|" << board[30] << "|" << board[29] << "|" << board[28] << "|" << board[27]
                 << "|" << board[26] << "|" << board[25] << "|" << board[24] << "|" << board[23] <<  "|" << endl;
            cout << midspace << bar << midspace << endl;
            cout << space << "|" << board[44] << "|" << board[31] << "|" << endl;
            cout << space << bar << endl;
            cout << space << "|" << board[43] << "|" << board[32] << "|" << endl;
            cout << space << bar << endl;
            cout << space << "|" << board[42] << "|" << board[33] << "|" << endl;
            cout << space << bar << endl;
            cout << space << "|" << board[41] << "|" << board[34] << "|" << endl;
            cout << space << bar << endl;
            cout << space << "|" << board[40] << "|" << board[35] << "|" << endl;
            cout << space << bar << endl;
            cout << space << "|" << board[39] << "|" << board[36] << "|" << endl;
            cout << space << bar << endl;
            cout << space << "|" << board[38] << "|" << board[37] << "|" << endl;
            cout << space << bar << endl;
        }
};

class Referee
{
    Player* playerL;
    Player* playerN;
    Board* board;
    bool gameover;

    public:
        // constructor
        Referee()
        {
            playerL = new Player('L');
            playerN = new Player('N');
            board = new Board();
            gameover = false;
        }
        // main gameplay function
        void Play()
        {
            int turn = 1;
            int lastturn = 0;
            int diceRoll = 0;
            int spot = 0;
            char input = ' ';

            // loop until winner
            while (!gameover)
            {
                // decide current player
                Player* currentPlayer = (turn % 2 == 1) ? playerL : playerN;
                srand(time(NULL));
                system("CLS");
                board->DrawBoard();
                // figure out if last move ended or if it is prompting for re-input
                if (lastturn != turn) {
                    diceRoll = rand() % 6;
                    lastturn = turn;
                } else {
                    if (spot == 7 || spot == 8 || spot == 22 || spot == 23 || spot == 37 || spot == 38 || spot == 52 || spot == 53) {
                        cout << "You landed on the edge! Move again." << endl << endl;
                        diceRoll = rand() % 6;
                    } else {
                        cout << "Invalid Move! Try again." << endl << endl;
                    }
                }
                // instant pass
                if (diceRoll == 0) {
                    cout << "You rolled a 0. You must pass your turn." << endl << endl;
                }
                cout << "Player L (Letters) Score: " << playerL->GetScore() << endl;
                cout << "Player N (Numbers) Score: " << playerN->GetScore() << endl << endl;
                cout << "Player " << currentPlayer->GetName() << "'s Turn (Turn " << turn << ")" << endl;
                cout << "The roll is: " << diceRoll << endl;
                cout << "Select a piece to move (" << currentPlayer->GetPieces() << " or P to Pass): ";

                cin >> input;
                input = toupper(input);
                // pass turn
                if (input == 'P' || diceRoll == 0) { 
                    turn++;
                    continue;
                }
                // validate input
                if (!(currentPlayer->GetPieces().find(input) < currentPlayer->GetPieces().length())) { continue; }
                int position = -1;
                // find if piece is on board
                for (int i = 0; i < 60; i++) {
                    if (board->GetValue(i) == input) { position = i; }
                }
                spot = (position + diceRoll) % 60;
                if (position >= 0) {
                    if (spot != 0 && spot != 15 && spot != 30 && spot != 45) {
                        if (board->GetValue(spot) != ' ') { continue; } // can't move to occupied space outside of middle
                    }
                    board->SetValue(spot, input);
                    board->SetValue(position, ' ');
                    if (spot == 7 || spot == 8 || spot == 22 || spot == 23 || spot == 37 || spot == 38 || spot == 52 || spot == 53) { continue; } // extra turn
                    // scoring
                    if (currentPlayer->GetName() == "L" && spot == 29) {
                        board->SetValue(29, ' ');
                        playerL->SetScore(playerL->GetScore() + 1);
                    }
                    if (currentPlayer->GetName() == "N" && spot == 59) {
                        board->SetValue(59, ' ');
                        playerN->SetScore(playerN->GetScore() + 1);
                    }
                    turn++;
                } else {
                    // add new piece to board
                    if (currentPlayer->GetName() == "L") {
                        if (board->GetValue(31) == ' ') { board->SetValue(31, input); } else { continue; }
                    } else {
                        if (board->GetValue(1) == ' ') { board->SetValue(1, input); } else { continue; }
                    }
                    turn++;
                }
                // win conditions
                if (playerL->GetScore() == 6) {
                    cout << endl << "PLAYER L WINS" << endl;
                    gameover = true;
                } else if (playerN->GetScore() == 6) {
                    cout << endl << "PLAYER N WINS" << endl;
                    gameover = true;
                }
            }
        }
};

int main()
{
    Referee Game = Referee();
    Game.Play();
    return 0;
}
```

</div>
<br>
Here’s a screenshot of the game in action. It shows the initial setup phase and part of the turn cycle where players place pieces and roll the die. The visual layout of the board and player prompts were designed to be easy to follow, even in a simple text-based interface.
<br>

<div style="display: flex; justify-content: space-between; gap: 1rem; margin-top: 2rem;">
  <!-- First Image -->
  <div style="flex: 1; text-align: center;">
    <p style="margin-top: 0.5rem; font-size: 1.2em; color: #777;">Initial Game State</p>
    <img src="/images/patolli1.png" style="width: 500px; height: 700px; object-fit: cover; border: 1px solid #ccc; border-radius: 8px;">
  </div>

  <!-- Second Image -->
  <div style="flex: 1; text-align: center;">
    <p style="margin-top: 0.5rem; font-size: 1.2em; color: #777;">State of Game after Move 50</p>
    <img src="/images/patolli2.png" style="width: 500px; height: 700px; object-fit: cover; border: 1px solid #ccc; border-radius: 8px;">
  </div>
</div>