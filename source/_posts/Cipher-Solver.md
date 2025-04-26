---
title: Cipher Solver
date: 2024-04-21
category: Problem-Solving
tags:
    - Programming
    - Python
---

This project pushed me to think through multiple cipher decryption strategies and actually build them out in Python from scratch. I had to reverse-engineer classic ciphers like Caesar, Vigenère, and Rail Fence, and then layer in brute-force logic and scoring to find the most likely plaintext. It wasn’t just about writing code—it was about figuring out how to crack encrypted messages efficiently and accurately. Each function I built tested my ability to break down problems and design clean, modular solutions.

<div style="max-height: 400px; overflow-y: auto; font-size: 0.9em;">
```Python
import string

# function for Caesar Cipher
def caesar(ciphertext, shift):
    shift *= -1
    cleartext = ""
    for char in ciphertext:
        if char.isalpha():
            shifted = ord(char) - shift
            if char.islower():
                cleartext += chr((shifted - ord('a')) % 26 + ord('a'))
            if char.isupper():
                cleartext += chr((shifted - ord('A')) % 26 + ord('A'))
        else:
            cleartext += char
    return cleartext

# function to calculate euclidean greatest common divisor
def egcd(a, b):
    if a == 0:
        return (b, 0, 1)
    else:
        g, y, x = egcd(b % a, a)
        return (g, x - (b // a) * y, y)

# function to calculate modular multiplicitive inverse used in affine cipher
def modinv(a, m):
    g, x, y = egcd(a, m)
    if g != 1:
        return None
    else:
        return x % m

# function for affine cipher
def affine(ciphertext, a, b):
    cleartext = ''
    a_inv = modinv(a, 26)
    if a_inv == None: return cleartext
    for char in ciphertext:
        if char in string.ascii_letters:
            if char.islower():
                cleartext += chr(((a_inv * (ord(char) - ord('a') - b)) % 26) + ord('a'))
            else:
                cleartext += chr(((a_inv * (ord(char) - ord('A') - b)) % 26) + ord('A'))
        else:
            cleartext += char
    return cleartext

# function for atbash cipher
def atbash(ciphertext):
    table = str.maketrans(string.ascii_letters, string.ascii_lowercase[::-1] + string.ascii_uppercase[::-1])
    cleartext = ciphertext.translate(table)
    return cleartext

# function for rail-fence cipher
def railfence(ciphertext, key):
    rail = [['\n' for i in range(len(ciphertext))] for j in range(key)]
    down = None
    row, col = 0, 0
    for i in range(len(ciphertext)):
        if row == 0:
            down = True
        if row == key - 1:
            down = False
        rail[row][col] = '*'
        col += 1
        if down:
            row += 1
        else:
            row -= 1
    index = 0
    for i in range(key):
        for j in range(len(ciphertext)):
            if ((rail[i][j] == '*') and (index < len(ciphertext))):
                rail[i][j] = ciphertext[index]
                index += 1
    cleartext = []
    row, col = 0, 0
    for i in range(len(ciphertext)):
        if row == 0:
            down = True
        if row == key - 1:
            down = False
        if (rail[row][col] != '*'):
            cleartext.append(rail[row][col])
            col += 1
        if down:
            row += 1
        else:
            row -= 1
    return("".join(cleartext))

# function for vigenere cipher
def vigenere(ciphertext, key):
    cleartext = []
    index = 0
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    key = key.upper()
    for char in ciphertext:
        num = letters.find(char.upper())
        if num != -1:
            num -= letters.find(key[index])
            num %= len(letters)
            if char.isupper():
                cleartext.append(letters[num])
            elif char.islower():
                cleartext.append(letters[num].lower())
            index += 1
            if index == len(key):
                index = 0
        else:
            cleartext.append(char)
    return("".join(cleartext))

# function to grade output by comparing each word with words in a wordlist
def score(input, wordlist):
    if input == "": return 0
    words = input.split()
    hit = 0
    size = len(words)
    for word in words:
        for w in wordlist:
            if w == word: hit += 1
    return(round((hit / size) * 100))

# function to print the top results based on score
def printTop(arr, amt):
    arr = sorted(arr, key=lambda x: x[3], reverse=True)
    for i in range(amt):
        print("{}% {} with key of {}: {}".format(arr[i][3], arr[i][0], arr[i][2], arr[i][1]))

#ctext = "twxd ms p ipwt pcdaeg uzv twt avovglq"
ctext = input("Enter text to attempt decryption:\n")

# load wordlist
with open("words.txt", 'r') as file:
        wordlist = file.read().splitlines()

# Caesar
solutions = []
for i in range(26):
    plaintext = caesar(ctext, i)
    solutions += [["Caesar Cipher", plaintext, i, score(plaintext, wordlist)]]

#Affine
for i in range(1, 20, 2):
    for j in range(10):
        plaintext = affine(ctext, i, j)
        solutions += [["Affine Cipher", plaintext, "{}, {}".format(i, j), score(plaintext, wordlist)]]

#Atbash
plaintext = atbash(ctext)
solutions += [["Atbash Cipher", plaintext, "N/A", score(plaintext, wordlist)]]

#Railfence
for i in range(2, 20):
    plaintext = railfence(ctext, i)
    solutions += [["Railfence Cipher", plaintext, i, score(plaintext, wordlist)]]

#Vigenere
for w in wordlist:
    plaintext = vigenere(ctext, w)
    solutions += [["Vigenere Cipher", plaintext, w, score(plaintext, wordlist)]]

printTop(solutions, 5)
```
</div>
<br>

Writing detailed documentation for this project made me slow down and really think through each part of the logic I wrote. Explaining how the functions work—especially things like the modular inverse or how Rail Fence decryption rebuilds the zigzag pattern—forced me to get super clear on the why behind my code. It helped me sharpen how I communicate complex logic, which is just as important as solving the problem itself.

<embed src="/files/Cipher Solver.pdf" type="application/pdf" width="100%" height="800px">
<br>

Here's a peek at the Cipher Solver in action—plug in some encrypted text, and it brute-forces multiple classic ciphers to guess the original message. It even ranks the most likely results using a wordlist to score how readable each output is. In this screenshot, I'm showcasing how by just inputting ciphertext, it can figure out the correct cipher and the correct keys (in this example, Vigenère, Rail Fence, and Affine)

<img src="/images/cipher_solver.png" style="width: 100%; height: 100%; object-fit: cover; border: 1px solid #ccc; border-radius: 8px;">