"""
seed_courses.py — Seeds 4 complete courses with modules, lessons, quizzes, and projects.
Run with: python scripts/seed_courses.py (from apps/api directory)
"""
import sys
import os
import json
import uuid
from datetime import datetime, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from app.models.course import Course, CourseModule, Lesson, QuizQuestion, Project

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'dev.db'))
engine = create_engine(f"sqlite:///{DB_PATH}", echo=False)
SessionLocal = sessionmaker(bind=engine)


# ─── Content block builders ─────────────────────────────────────────────────

def blocks(*items):
    """Pack a list of block dicts into a JSON string."""
    return json.dumps(list(items))

def heading(text): return {"type": "heading", "content": text}
def text(t): return {"type": "text", "content": t}
def code(content, lang="python", output=None): return {"type": "code", "content": content, "language": lang, "output": output}
def tip(t): return {"type": "tip", "content": t}
def warn(t): return {"type": "warning", "content": t}
def lst(*items): return {"type": "list", "content": list(items)}
def example(t): return {"type": "example", "content": t}
def practice(q, a): return {"type": "practice", "content": f"{q}|||{a}"}

# ─── Python lessons ──────────────────────────────────────────────────────────

PYTHON_MODULES = [
    {
        "number": 1, "title": "Python Fundamentals", "description": "Learn what Python is, how to install it, and write your first programs.", "hours": 4,
        "lessons": [
            {
                "number": 1, "title": "Introduction to Python", "minutes": 20,
                "content": blocks(
                    heading("What is Python?"),
                    text("Python is a high-level, interpreted, general-purpose programming language created by Guido van Rossum and first released in 1991. Its design philosophy emphasizes code readability — Python code reads almost like plain English. It is dynamically typed (you don't declare variable types) and uses garbage collection for memory management."),
                    lst("Used in: Web Development, Data Science, AI/ML, Automation, Cybersecurity, Game Development",
                        "Python runs on Windows, macOS, and Linux",
                        "Currently on Python 3 (Python 2 reached end-of-life in 2020)",
                        "Huge ecosystem: 300,000+ packages on PyPI"),
                    heading("Why Learn Python?"),
                    text("Python consistently ranks as the #1 most popular programming language (TIOBE, Stack Overflow surveys). It is beginner-friendly but used by industry giants like Google, Netflix, Instagram, NASA, and Spotify. It's the primary language for Data Science and Machine Learning."),
                    code("# Your first Python program\nprint('Hello, World!')\nprint('Python is awesome!')", "python", "Hello, World!\nPython is awesome!"),
                    tip("Python uses indentation (spaces/tabs) instead of curly braces {} for code blocks. This enforces clean, readable code from the start."),
                    warn("Never mix tabs and spaces for indentation in Python — it causes an IndentationError. Always use 4 spaces (PEP 8 standard)."),
                    example("Real-world: Instagram's backend is written in Python (Django framework). When you scroll Instagram, Python servers handle your requests."),
                    practice("What are 3 industries where Python is widely used?", "Web Development, Data Science/AI/ML, and Automation/Scripting"),
                )
            },
            {
                "number": 2, "title": "Variables and Data Types", "minutes": 25,
                "content": blocks(
                    heading("What is a Variable?"),
                    text("A variable is a named container that stores a value in memory. In Python, you create a variable by simply assigning a value to a name using the = operator. Unlike C or Java, you do NOT need to declare the type first — Python figures it out automatically (dynamic typing)."),
                    code("# Creating variables\nname = 'Alice'          # str (string)\nage = 20               # int (integer)\ngpa = 3.75             # float (decimal)\nis_student = True      # bool (True/False)\nno_value = None        # NoneType\n\nprint(type(name))      # <class 'str'>\nprint(type(age))       # <class 'int'>\nprint(type(gpa))       # <class 'float'>", "python", "<class 'str'>\n<class 'int'>\n<class 'float'>"),
                    heading("Python's Built-in Data Types"),
                    lst("int — whole numbers: 5, -3, 1000000",
                        "float — decimal numbers: 3.14, -0.5, 2.0e8",
                        "str — text in single/double quotes: 'hello', \"world\"",
                        "bool — True or False (case-sensitive in Python!)",
                        "NoneType — represents absence of a value: None"),
                    heading("Type Conversion"),
                    code("# Convert between types\nx = '42'          # This is a string\ny = int(x)        # Convert to integer → 42\nz = float(x)      # Convert to float → 42.0\n\nnum = 3.99\ntruncated = int(num)  # → 3 (NOT rounded, truncated!)\nformatted = str(num)  # → '3.99'\n\nprint(int('100') + 5)  # → 105", "python", "105"),
                    tip("Use type() to check any variable's type: print(type(x)). Use isinstance(x, int) to check if x is an integer — more Pythonic for type checking."),
                    warn("int('3.14') raises a ValueError! You must do int(float('3.14')) to convert a decimal string to int."),
                    example("Real-world: User input from a web form always comes as a string. If a user types their age as '25', you must convert it: age = int(request.data['age']) before doing arithmetic."),
                    practice("What does type(3.14) return?", "<class 'float'>"),
                    practice("Write code to get a user's age as input and calculate their birth year.", "year_of_birth = 2024 - int(input('Enter your age: '))"),
                )
            },
            {
                "number": 3, "title": "Input and Output", "minutes": 20,
                "content": blocks(
                    heading("The print() Function"),
                    text("print() displays output to the terminal. It can take multiple arguments separated by commas. You can customize how values are separated with the 'sep' parameter and control the line ending with 'end'."),
                    code("name = 'Venkatesh'\nage = 21\n\n# Basic print\nprint('Hello,', name)                   # Hello, Venkatesh\n\n# Using sep and end\nprint('A', 'B', 'C', sep='-')           # A-B-C\nprint('Loading', end='...')             # Loading... (no newline)\nprint('Done')                           # Loading...Done\n\n# f-strings (formatted string literals) — most modern way\nprint(f'My name is {name} and I am {age} years old.')\n# → My name is Venkatesh and I am 21 years old.", "python"),
                    heading("Getting Input from the User"),
                    code("# input() always returns a STRING\nname = input('Enter your name: ')\nprint(f'Hello, {name}!')           # Hello, Venkatesh!\n\n# Convert types after input\nage = int(input('Enter your age: '))   # '21' → 21\ngpa = float(input('Enter GPA: '))       # '3.7' → 3.7\n\n# Multiple inputs on one line\nx, y = input('Enter two numbers: ').split()\nprint(int(x) + int(y))", "python"),
                    tip("f-strings (f'Hello {name}') are the preferred modern way to format strings in Python 3.6+. They are faster and more readable than .format() or % formatting."),
                    warn("input() always returns a string! This is a very common bug: if user enters '5' and you do 5 + user_input without converting, Python will do '5' + '5' = '55' not 10."),
                    practice("Write a program that asks for first name and last name separately, then prints the full name.", "first = input('First name: ')\nlast = input('Last name: ')\nprint(f'Full name: {first} {last}')"),
                )
            },
            {
                "number": 4, "title": "Operators", "minutes": 25,
                "content": blocks(
                    heading("Arithmetic Operators"),
                    code("a, b = 10, 3\nprint(a + b)    # 13  (addition)\nprint(a - b)    # 7   (subtraction)\nprint(a * b)    # 30  (multiplication)\nprint(a / b)    # 3.3333... (true division — always float)\nprint(a // b)   # 3   (floor division — drops decimal)\nprint(a % b)    # 1   (modulus — remainder)\nprint(a ** b)   # 1000 (exponentiation: 10^3)", "python", "13\n7\n30\n3.3333333333333335\n3\n1\n1000"),
                    heading("Comparison and Logical Operators"),
                    code("x, y = 5, 10\nprint(x == y)   # False\nprint(x != y)   # True\nprint(x < y)    # True\nprint(x >= 5)   # True\n\n# Logical operators\nprint(x > 0 and y > 0)   # True (both true)\nprint(x > 0 or y < 0)    # True (at least one true)\nprint(not x == y)         # True (negation)", "python"),
                    heading("Assignment and Membership Operators"),
                    code("# Assignment\ncount = 0\ncount += 1     # count = count + 1 → 1\ncount *= 2     # count = count * 2 → 2\n\n# Membership\nfruits = ['apple', 'banana', 'cherry']\nprint('apple' in fruits)      # True\nprint('mango' not in fruits)  # True", "python"),
                    tip("The modulo operator (%) is extremely useful for checking if a number is even (n % 2 == 0), finding remainder in division, and cycling through indices."),
                    practice("Write a FizzBuzz check: if n is divisible by 3 print 'Fizz', by 5 print 'Buzz', both print 'FizzBuzz'.", "n = 15\nif n % 3 == 0 and n % 5 == 0:\n    print('FizzBuzz')\nelif n % 3 == 0:\n    print('Fizz')\nelif n % 5 == 0:\n    print('Buzz')"),
                )
            },
            {
                "number": 5, "title": "Comments and Code Style (PEP 8)", "minutes": 15,
                "content": blocks(
                    heading("Why Comments and Style Matter"),
                    text("Professional code is read far more than it is written. Code style and comments are not optional — they are how you communicate intent to your team (and your future self). PEP 8 is Python's official style guide followed across the industry."),
                    code("# This is a single-line comment — anything after # is ignored\n\ndef calculate_area(radius):\n    \"\"\"Calculate the area of a circle.\n    \n    Args:\n        radius: The radius of the circle in meters.\n    Returns:\n        float: Area in square meters.\n    \"\"\"\n    PI = 3.14159  # Mathematical constant\n    return PI * radius ** 2\n\narea = calculate_area(5)\nprint(f'Area: {area:.2f}')  # Area: 78.54", "python", "Area: 78.54"),
                    heading("PEP 8 Key Rules"),
                    lst("Variable names: snake_case (my_variable, not myVariable)",
                        "Constants: ALL_CAPS (MAX_SIZE = 100)",
                        "Class names: PascalCase (StudentProfile)",
                        "Functions/methods: snake_case (calculate_total())",
                        "Line length: max 79 characters per line",
                        "Two blank lines between top-level functions",
                        "One blank line between methods inside a class"),
                    tip("Install the 'black' code formatter: pip install black. Run black myfile.py to auto-format your entire file according to PEP 8 standards in one command."),
                    warn("Avoid using single letters for variable names (except loop counters like i, j). bad: x = 10 — good: student_age = 10"),
                )
            },
        ],
        "quiz": [
            {"question": "What data type does Python's input() function always return?", "options": ["int", "str", "bool", "float"], "correct": 1, "explanation": "input() always returns a string (str), even if the user types a number."},
            {"question": "What is the result of 10 // 3 in Python?", "options": ["3.33", "3", "1", "4"], "correct": 1, "explanation": "// is floor division — it returns the integer quotient without the remainder."},
            {"question": "Which of these is a valid Python variable name?", "options": ["2fast", "my-var", "my_var", "class"], "correct": 2, "explanation": "Variable names must start with a letter or underscore, use only letters/digits/underscores, and not be a reserved keyword."},
            {"question": "What does type(True) return?", "options": ["<class 'bool'>", "<class 'int'>", "<class 'str'>", "<class 'NoneType'>"], "correct": 0, "explanation": "True and False are bool type in Python."},
            {"question": "Which operator gives the remainder of division?", "options": ["//", "/", "%", "**"], "correct": 2, "explanation": "The modulo operator (%) returns the remainder: 10 % 3 = 1."},
        ]
    },
    {
        "number": 2, "title": "Control Flow", "description": "Master if statements, loops, and program flow control.", "hours": 5,
        "lessons": [
            {"number": 1, "title": "if Statement", "minutes": 20,
             "content": blocks(
                 heading("Making Decisions with if"),
                 text("An if statement lets your program make decisions. If a condition is True, the indented block runs. If False, Python skips it. This is the foundation of all programming logic."),
                 code("# Grade checker\nscore = 85\n\nif score >= 90:\n    print('Grade: A')\nelif score >= 80:\n    print('Grade: B')     # This runs!\nelif score >= 70:\n    print('Grade: C')\nelse:\n    print('Grade: F')", "python", "Grade: B"),
                 code("# Ternary (one-line) if-else\nage = 20\nstatus = 'Adult' if age >= 18 else 'Minor'\nprint(status)   # Adult", "python", "Adult"),
                 tip("Python evaluates conditions from top to bottom. Once one elif is True, the rest are skipped. Order your conditions from most specific to least specific."),
                 warn("Don't use = (assignment) instead of == (comparison) in conditions. if x = 5 is a SyntaxError in Python."),
                 practice("Write code that checks if a number is positive, negative, or zero.", "num = int(input('Enter a number: '))\nif num > 0:\n    print('Positive')\nelif num < 0:\n    print('Negative')\nelse:\n    print('Zero')"),
             )},
            {"number": 2, "title": "for Loops", "minutes": 25,
             "content": blocks(
                 heading("Repeating Actions with for Loops"),
                 text("A for loop repeats a block of code for each item in a sequence. This saves you from writing the same code dozens of times. In Python, for loops are very versatile — they work with lists, strings, ranges, tuples, dictionaries, and any iterable."),
                 code("# Loop over a list\nfruits = ['apple', 'banana', 'cherry']\nfor fruit in fruits:\n    print(f'I like {fruit}')\n\n# Loop using range\nfor i in range(1, 6):   # 1, 2, 3, 4, 5\n    print(i * i)         # squares: 1, 4, 9, 16, 25\n\n# Loop with enumerate (get index + value)\nfor index, fruit in enumerate(fruits):\n    print(f'{index}: {fruit}')", "python", "I like apple\nI like banana\nI like cherry\n1\n4\n9\n16\n25\n0: apple\n1: banana\n2: cherry"),
                 code("# range() parameters: range(start, stop, step)\nfor i in range(0, 10, 2):  # even numbers\n    print(i, end=' ')       # 0 2 4 6 8\n\nfor i in range(10, 0, -1): # countdown\n    print(i, end=' ')       # 10 9 8 7 6 5 4 3 2 1", "python"),
                 tip("Use enumerate() when you need both the index and value of a list — it's more Pythonic than using range(len(mylist))."),
                 practice("Use a for loop to calculate the sum of all numbers from 1 to 100.", "total = 0\nfor i in range(1, 101):\n    total += i\nprint(total)  # 5050"),
             )},
            {"number": 3, "title": "while Loops", "minutes": 20,
             "content": blocks(
                 heading("while Loops — Repeat Until False"),
                 text("A while loop keeps running as long as a condition is True. You use it when you don't know in advance how many times to loop — for example, waiting for valid user input."),
                 code("# Count from 1 to 5\ncount = 1\nwhile count <= 5:\n    print(count)\n    count += 1  # CRUCIAL: must modify condition variable!\n\n# Input validation loop\nwhile True:\n    age = int(input('Enter age (1-120): '))\n    if 1 <= age <= 120:\n        break  # exit loop when valid\n    print('Invalid! Try again.')\nprint(f'Your age: {age}')", "python", "1\n2\n3\n4\n5"),
                 tip("Always ensure the while loop condition eventually becomes False, or use break to exit. Infinite loops can crash your program and use 100% CPU."),
                 warn("Forgetting to update the loop variable is the #1 while loop bug. If count never changes in count < 10, you get an infinite loop!"),
                 practice("Write a while loop that prints all even numbers between 1 and 20.", "n = 2\nwhile n <= 20:\n    print(n, end=' ')\n    n += 2"),
             )},
            {"number": 4, "title": "break, continue, pass", "minutes": 15,
             "content": blocks(
                 heading("Controlling Loop Execution"),
                 code("# break — exit the loop immediately\nfor i in range(10):\n    if i == 5:\n        break\n    print(i, end=' ')   # 0 1 2 3 4\n\n# continue — skip to next iteration\nfor i in range(10):\n    if i % 2 == 0:\n        continue         # skip even numbers\n    print(i, end=' ')   # 1 3 5 7 9\n\n# pass — placeholder, does nothing\nfor i in range(5):\n    pass  # loop runs but no body yet", "python", "0 1 2 3 4\n1 3 5 7 9"),
                 tip("Use break for search algorithms (stop when found), continue to filter out unwanted items, and pass as a temporary placeholder when you're writing structure first."),
             )},
            {"number": 5, "title": "Loop Practice: Patterns and Problems", "minutes": 30,
             "content": blocks(
                 heading("Classic Loop Problems"),
                 code("# Fibonacci sequence (first 10 numbers)\na, b = 0, 1\nfor _ in range(10):\n    print(a, end=' ')   # 0 1 1 2 3 5 8 13 21 34\n    a, b = b, a + b\n\n# Check if a number is prime\ndef is_prime(n):\n    if n < 2: return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprimes = [n for n in range(2, 30) if is_prime(n)]\nprint(primes)  # [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]", "python", "0 1 1 2 3 5 8 13 21 34\n[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]"),
                 code("# Star pattern\nfor i in range(1, 6):\n    print('*' * i)\n\n# Output:\n# *\n# **\n# ***\n# ****\n# *****", "python"),
                 practice("Write a program to calculate the factorial of a number using a loop.", "n = int(input('Enter number: '))\nresult = 1\nfor i in range(1, n + 1):\n    result *= i\nprint(f'{n}! = {result}')"),
             )},
        ],
        "quiz": [
            {"question": "What does range(2, 10, 2) produce?", "options": ["[2, 4, 6, 8]", "[2, 4, 6, 8, 10]", "[0, 2, 4, 6, 8]", "[2, 3, 4, 5, 6, 7, 8, 9]"], "correct": 0, "explanation": "range(start, stop, step) produces 2, 4, 6, 8 — start at 2, increment by 2, stop before 10."},
            {"question": "Which statement immediately exits a loop?", "options": ["continue", "pass", "break", "exit"], "correct": 2, "explanation": "break immediately terminates the innermost loop and jumps to the code after it."},
            {"question": "What does 'continue' do in a loop?", "options": ["Exits the loop", "Skips to the next iteration", "Does nothing", "Pauses execution"], "correct": 1, "explanation": "continue skips the remaining code in the current iteration and moves to the next one."},
            {"question": "What is the output of: for i in range(3): print(i)?", "options": ["1 2 3", "0 1 2", "0 1 2 3", "1 2"], "correct": 1, "explanation": "range(3) generates 0, 1, 2. Range stops BEFORE the given number."},
            {"question": "A while True loop...", "options": ["Runs exactly once", "Never runs", "Runs forever unless broken", "Causes a syntax error"], "correct": 2, "explanation": "while True runs indefinitely. You must use break or return to exit it."},
        ]
    },
    {
        "number": 3, "title": "Data Structures", "description": "Master Python's built-in collections: lists, tuples, sets, and dictionaries.", "hours": 6,
        "lessons": [
            {"number": 1, "title": "Strings", "minutes": 25,
             "content": blocks(
                 heading("Working with Strings"),
                 text("Strings are sequences of characters. In Python, strings are immutable (you cannot change individual characters). You can use single quotes, double quotes, or triple quotes for multiline strings."),
                 code("name = 'Python'\nprint(name[0])      # 'P' (first char, 0-indexed)\nprint(name[-1])     # 'n' (last char)\nprint(name[0:3])    # 'Pyt' (slicing: start:stop)\nprint(name[::-1])   # 'nohtyP' (reversed)\nprint(len(name))    # 6\n\n# String methods\ntext = '  Hello World  '\nprint(text.strip())       # 'Hello World'\nprint(text.lower())       # '  hello world  '\nprint(text.upper())       # '  HELLO WORLD  '\nprint('hello world'.title())  # 'Hello World'\nprint('a,b,c'.split(',')) # ['a', 'b', 'c']\nprint(' '.join(['a','b','c']))  # 'a b c'", "python"),
                 tip("Strings support f-strings for powerful formatting: name='Ali'; f'Hello {name.upper()}!' → 'Hello ALI!'"),
                 warn("Strings are immutable! name[0] = 'J' raises a TypeError. You must create a new string: new_name = 'J' + name[1:]"),
             )},
            {"number": 2, "title": "Lists", "minutes": 30,
             "content": blocks(
                 heading("Python Lists — Ordered, Mutable Collections"),
                 text("A list stores multiple items in one variable. Lists are ordered (items have a fixed position), mutable (you can change them), and allow duplicates. They can hold items of different types."),
                 code("# Creating and accessing lists\nstudents = ['Alice', 'Bob', 'Charlie', 'Diana']\nprint(students[0])      # 'Alice'\nprint(students[-1])     # 'Diana'\nprint(students[1:3])    # ['Bob', 'Charlie']\n\n# Modifying lists\nstudents.append('Eve')       # Add to end\nstudents.insert(1, 'Frank')  # Insert at index 1\nstudents.remove('Bob')       # Remove first 'Bob'\npopped = students.pop()      # Remove and return last\nstudents.sort()              # Sort alphabetically\nstudents.reverse()           # Reverse order\n\nprint(len(students))         # 4\nprint('Alice' in students)   # True", "python"),
                 code("# List comprehension — the Python way!\nsquares = [x**2 for x in range(1, 6)]\nprint(squares)  # [1, 4, 9, 16, 25]\n\nevens = [x for x in range(20) if x % 2 == 0]\nprint(evens)    # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]", "python"),
                 practice("Create a list of 5 cities, sort it, and print the first and last city.", "cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad']\ncities.sort()\nprint(cities[0], cities[-1])  # Bangalore Mumbai"),
             )},
            {"number": 3, "title": "Tuples and Sets", "minutes": 20,
             "content": blocks(
                 heading("Tuples — Immutable Sequences"),
                 text("A tuple is like a list but IMMUTABLE (cannot be changed after creation). Use tuples for data that should not change: coordinates, database records, function return values."),
                 code("# Tuple basics\ncoordinates = (28.6, 77.2)   # Delhi's lat/lon\nrgb_red = (255, 0, 0)\nprint(coordinates[0])         # 28.6\nprint(len(rgb_red))           # 3\n\n# Tuple unpacking (very powerful!)\nx, y = coordinates\nlatitude, longitude = coordinates\nprint(f'Lat: {latitude}, Lon: {longitude}')\n\n# Tuples in functions\ndef min_max(nums):\n    return min(nums), max(nums)  # returns tuple\n\nlo, hi = min_max([3, 1, 4, 1, 5, 9, 2, 6])\nprint(f'Min: {lo}, Max: {hi}')", "python"),
                 heading("Sets — Unique, Unordered Collections"),
                 code("# Sets automatically remove duplicates!\nnums = {1, 2, 2, 3, 3, 3, 4}\nprint(nums)   # {1, 2, 3, 4}\n\n# Set operations\na = {1, 2, 3, 4, 5}\nb = {4, 5, 6, 7, 8}\nprint(a | b)   # Union: {1,2,3,4,5,6,7,8}\nprint(a & b)   # Intersection: {4,5}\nprint(a - b)   # Difference: {1,2,3}", "python"),
                 tip("Convert a list to a set to remove duplicates: unique = list(set(my_list)). This is a very common interview trick!"),
             )},
            {"number": 4, "title": "Dictionaries", "minutes": 30,
             "content": blocks(
                 heading("Dictionaries — Key-Value Storage"),
                 text("A dictionary stores data as key-value pairs. Think of it like a real dictionary: you look up a word (key) to get its definition (value). Keys must be unique and immutable (strings, numbers, or tuples). Values can be anything."),
                 code("# Creating a dictionary\nstudent = {\n    'name': 'Venkatesh',\n    'age': 21,\n    'grade': 'A',\n    'courses': ['Python', 'SQL', 'Data Science']\n}\n\n# Accessing values\nprint(student['name'])              # Venkatesh\nprint(student.get('age', 0))        # 21 (safe access)\n\n# Modifying dictionaries\nstudent['gpa'] = 3.8                # Add new key\nstudent['age'] = 22                 # Update existing key\ndel student['grade']                # Delete key\n\n# Iterating over dictionaries\nfor key, value in student.items():\n    print(f'{key}: {value}')", "python"),
                 code("# Real-world: Word frequency counter\ntext = 'the cat sat on the mat the cat'\nword_count = {}\nfor word in text.split():\n    word_count[word] = word_count.get(word, 0) + 1\nprint(word_count)\n# {'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1}", "python"),
                 practice("Create a dict of 3 students with their grades, then print only students who got above 75.", "grades = {'Alice': 85, 'Bob': 70, 'Charlie': 92}\nfor name, grade in grades.items():\n    if grade > 75:\n        print(f'{name}: {grade}')"),
             )},
            {"number": 5, "title": "Data Structure Practice", "minutes": 35,
             "content": blocks(
                 heading("Applying Data Structures to Real Problems"),
                 code("# Contact book using dict of dicts\ncontacts = {\n    'Alice': {'phone': '9876543210', 'email': 'alice@example.com'},\n    'Bob':   {'phone': '8765432109', 'email': 'bob@example.com'},\n}\n\ndef add_contact(name, phone, email):\n    contacts[name] = {'phone': phone, 'email': email}\n\ndef find_contact(name):\n    return contacts.get(name, 'Contact not found')\n\nadd_contact('Charlie', '7654321098', 'charlie@example.com')\nprint(find_contact('Alice'))   # {'phone': '9876543210', ...}", "python"),
                 code("# Student grade manager\nstudents = [\n    {'name': 'Priya', 'marks': [85, 90, 78, 92]},\n    {'name': 'Rahul', 'marks': [70, 65, 80, 75]},\n    {'name': 'Anita', 'marks': [95, 98, 92, 97]},\n]\n\nfor s in students:\n    avg = sum(s['marks']) / len(s['marks'])\n    grade = 'A' if avg >= 90 else 'B' if avg >= 80 else 'C'\n    print(f\"{s['name']}: Avg={avg:.1f}, Grade={grade}\")", "python", "Priya: Avg=86.2, Grade=B\nRahul: Avg=72.5, Grade=C\nAnita: Avg=95.5, Grade=A"),
                 tip("In interviews, think about which data structure fits: need fast lookup? dict. Need unique items? set. Need ordered/indexed access? list. Need unchangeable data? tuple."),
             )},
        ],
        "quiz": [
            {"question": "What does list.append(x) do?", "options": ["Inserts x at the beginning", "Adds x to the end", "Removes x", "Sorts the list"], "correct": 1, "explanation": "append() adds the element to the END of the list."},
            {"question": "Which data structure automatically removes duplicates?", "options": ["list", "tuple", "set", "dict"], "correct": 2, "explanation": "Sets only store unique elements — adding a duplicate has no effect."},
            {"question": "How do you safely access a dict key that might not exist?", "options": ["dict[key]", "dict.get(key, default)", "dict.find(key)", "dict.fetch(key)"], "correct": 1, "explanation": "dict.get(key, default) returns the default value instead of raising a KeyError if the key is missing."},
            {"question": "Which of these is IMMUTABLE?", "options": ["list", "dict", "tuple", "set"], "correct": 2, "explanation": "Tuples cannot be modified after creation. This is their key difference from lists."},
            {"question": "What is the output of len({'a':1, 'b':2, 'c':3})?", "options": ["6", "3", "2", "Error"], "correct": 1, "explanation": "len() on a dictionary returns the number of key-value pairs, which is 3."},
        ]
    },
    {
        "number": 4, "title": "Functions", "description": "Write reusable, modular code using Python functions.", "hours": 5,
        "lessons": [
            {"number": 1, "title": "Defining Functions", "minutes": 25,
             "content": blocks(
                 heading("What is a Function?"),
                 text("A function is a named, reusable block of code that performs a specific task. Functions help you avoid repeating code (DRY — Don't Repeat Yourself), organize code into logical units, and make debugging easier."),
                 code("# Basic function\ndef greet(name):\n    \"\"\"Greet a user by name.\"\"\"\n    message = f'Hello, {name}!'\n    return message\n\n# Calling the function\nprint(greet('Venkatesh'))   # Hello, Venkatesh!\nprint(greet('Priya'))       # Hello, Priya!\n\n# Function with multiple returns\ndef divide(a, b):\n    if b == 0:\n        return None, 'Cannot divide by zero'\n    return a / b, None\n\nresult, error = divide(10, 2)\nif error:\n    print(error)\nelse:\n    print(result)   # 5.0", "python"),
                 tip("A function should do ONE thing and do it well. If you find yourself using 'and' to describe what your function does, it should be two functions."),
                 warn("Don't forget the return statement! A function without return returns None. Also, code after a return statement is unreachable."),
             )},
            {"number": 2, "title": "Parameters, *args, **kwargs", "minutes": 25,
             "content": blocks(
                 heading("Function Parameters in Depth"),
                 code("# Different parameter types\ndef describe_person(name, age, city='Unknown'):\n    return f'{name}, age {age}, from {city}'\n\n# Positional and keyword arguments\nprint(describe_person('Alice', 25))              # Unknown city\nprint(describe_person('Bob', 30, 'Mumbai'))       # Mumbai\nprint(describe_person(age=28, name='Charlie'))    # keyword args\n\n# *args — variable number of positional arguments\ndef sum_all(*numbers):\n    return sum(numbers)  # numbers is a tuple\n\nprint(sum_all(1, 2, 3, 4, 5))   # 15\n\n# **kwargs — variable keyword arguments\ndef build_profile(**info):\n    for key, val in info.items():\n        print(f'{key}: {val}')\n\nbuild_profile(name='Ali', age=22, gpa=3.9)", "python"),
             )},
            {"number": 3, "title": "Lambda Functions", "minutes": 15,
             "content": blocks(
                 heading("Lambda — Anonymous Single-Expression Functions"),
                 code("# Regular function vs lambda\ndef square(x): return x ** 2\nsquare_lambda = lambda x: x ** 2\nprint(square(5))        # 25\nprint(square_lambda(5)) # 25\n\n# Most useful with map(), filter(), sorted()\nnumbers = [3, 1, 4, 1, 5, 9, 2, 6]\n\nsorted_nums = sorted(numbers)              # [1, 1, 2, 3, 4, 5, 6, 9]\nreversed_sorted = sorted(numbers, key=lambda x: -x)  # [9, 6, 5, 4, 3, 2, 1, 1]\n\nsquared = list(map(lambda x: x**2, numbers))\nevens = list(filter(lambda x: x % 2 == 0, numbers))\n\nprint(squared)  # [9, 1, 16, 1, 25, 81, 4, 36]\nprint(evens)    # [4, 2, 6]", "python"),
                 tip("Use lambda for short, simple functions used in one place. For anything more complex, use a regular def function."),
             )},
            {"number": 4, "title": "Recursion", "minutes": 25,
             "content": blocks(
                 heading("Functions That Call Themselves"),
                 text("Recursion is when a function calls itself. Every recursive function needs: 1) A BASE CASE that stops the recursion, and 2) A RECURSIVE CASE that makes progress toward the base case."),
                 code("# Factorial using recursion: 5! = 5 * 4 * 3 * 2 * 1\ndef factorial(n):\n    # Base case\n    if n == 0 or n == 1:\n        return 1\n    # Recursive case\n    return n * factorial(n - 1)\n\nprint(factorial(5))   # 120\nprint(factorial(10))  # 3628800\n\n# Fibonacci (classic recursion)\ndef fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n\nprint([fib(i) for i in range(10)])  # [0,1,1,2,3,5,8,13,21,34]", "python"),
                 warn("Deep recursion can cause a RecursionError (stack overflow). Python's default recursion limit is 1000. For deep problems, use iteration or sys.setrecursionlimit()."),
             )},
            {"number": 5, "title": "Built-in Functions Reference", "minutes": 20,
             "content": blocks(
                 heading("Python's Most Useful Built-in Functions"),
                 code("# Type and conversion\nprint(type(42))            # <class 'int'>\nprint(isinstance(42, int)) # True\nprint(int('100'))          # 100\nprint(str(3.14))           # '3.14'\nprint(list((1, 2, 3)))     # [1, 2, 3]\nprint(dict(a=1, b=2))      # {'a': 1, 'b': 2}\n\n# Numeric\nprint(abs(-5))             # 5\nprint(round(3.7))          # 4\nprint(max(3, 1, 4, 1, 5))  # 5\nprint(min([3, 1, 4]))      # 1\nprint(sum(range(1, 101)))  # 5050\n\n# Iterables\nprint(len([1, 2, 3]))      # 3\nprint(sorted([3,1,2]))     # [1, 2, 3]\nprint(list(reversed([1,2,3])))  # [3, 2, 1]\nprint(list(enumerate(['a','b','c'])))  # [(0,'a'),(1,'b'),(2,'c')]\nprint(list(zip([1,2], ['a','b'])))     # [(1,'a'),(2,'b')]", "python"),
             )},
        ],
        "quiz": [
            {"question": "What does a function return if there is no return statement?", "options": ["0", "False", "None", "Error"], "correct": 2, "explanation": "Python functions implicitly return None when no return statement is present."},
            {"question": "What is *args used for?", "options": ["Passing keyword arguments", "Passing a variable number of positional arguments", "Creating a list", "Multiplying arguments"], "correct": 1, "explanation": "*args lets a function accept any number of positional arguments as a tuple."},
            {"question": "What is the base case in recursion used for?", "options": ["To make the function faster", "To stop infinite recursion", "To pass arguments", "To return None"], "correct": 1, "explanation": "The base case stops the recursion. Without it, the function would call itself forever."},
            {"question": "What does sorted([3,1,2], reverse=True) return?", "options": ["[1, 2, 3]", "[3, 2, 1]", "[2, 1, 3]", "Error"], "correct": 1, "explanation": "reverse=True sorts in descending order."},
            {"question": "What does lambda x: x**2 represent?", "options": ["A class", "A decorator", "An anonymous function that squares its input", "A loop"], "correct": 2, "explanation": "Lambda creates a small anonymous function. This one takes x and returns x squared."},
        ]
    },
    {
        "number": 5, "title": "Object-Oriented Programming", "description": "Understand OOP: classes, objects, inheritance, and encapsulation.", "hours": 7,
        "lessons": [
            {"number": 1, "title": "Classes and Objects", "minutes": 30,
             "content": blocks(
                 heading("Introduction to Object-Oriented Programming"),
                 text("OOP is a programming paradigm that organizes code around objects — bundles of data (attributes) and behavior (methods). The four pillars of OOP are: Encapsulation, Inheritance, Polymorphism, and Abstraction."),
                 code("# Defining a class\nclass Student:\n    # Class variable (shared by all instances)\n    school = 'Tech University'\n    \n    def __init__(self, name, age, gpa):\n        # Instance variables (unique per object)\n        self.name = name\n        self.age = age\n        self.gpa = gpa\n    \n    def greet(self):\n        return f'Hi, I am {self.name}, GPA: {self.gpa}'\n    \n    def __str__(self):\n        return f'Student({self.name}, {self.age})'\n\n# Creating objects (instances)\ns1 = Student('Alice', 20, 3.8)\ns2 = Student('Bob', 22, 3.5)\n\nprint(s1.greet())          # Hi, I am Alice, GPA: 3.8\nprint(s2.name)             # Bob\nprint(Student.school)      # Tech University\nprint(str(s1))             # Student(Alice, 20)", "python"),
             )},
            {"number": 2, "title": "Inheritance", "minutes": 25,
             "content": blocks(
                 heading("Inheriting Properties and Behavior"),
                 code("class Animal:\n    def __init__(self, name, species):\n        self.name = name\n        self.species = species\n    \n    def speak(self):\n        return f'{self.name} makes a sound.'\n    \n    def __repr__(self):\n        return f'{self.species}({self.name})'\n\nclass Dog(Animal):  # Dog inherits from Animal\n    def __init__(self, name):\n        super().__init__(name, 'Dog')  # Call parent __init__\n        self.tricks = []\n    \n    def speak(self):  # Override parent method\n        return f'{self.name} says: Woof!'\n    \n    def learn_trick(self, trick):\n        self.tricks.append(trick)\n\nd = Dog('Rex')\nprint(d.speak())         # Rex says: Woof!\nprint(repr(d))           # Dog(Rex)\nprint(isinstance(d, Animal))  # True (is-a relationship)", "python"),
             )},
            {"number": 3, "title": "Encapsulation and Properties", "minutes": 20,
             "content": blocks(
                 heading("Protecting Data with Encapsulation"),
                 code("class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.__balance = balance  # Private (name-mangled)\n    \n    @property\n    def balance(self):  # Getter\n        return self.__balance\n    \n    @balance.setter\n    def balance(self, amount):  # Setter with validation\n        if amount < 0:\n            raise ValueError('Balance cannot be negative')\n        self.__balance = amount\n    \n    def deposit(self, amount):\n        if amount > 0:\n            self.__balance += amount\n            return True\n        return False\n\nacc = BankAccount('Alice', 1000)\nprint(acc.balance)     # 1000 (via getter)\nacc.deposit(500)       # Modifies through method\nprint(acc.balance)     # 1500", "python"),
             )},
            {"number": 4, "title": "Polymorphism and Magic Methods", "minutes": 20,
             "content": blocks(
                 heading("Many Forms — Polymorphism"),
                 code("class Shape:\n    def area(self): raise NotImplementedError\n\nclass Circle(Shape):\n    def __init__(self, r): self.r = r\n    def area(self): return 3.14159 * self.r ** 2\n    def __len__(self): return int(self.r)  # Custom len()\n    def __add__(self, other): return Circle(self.r + other.r)\n\nclass Rectangle(Shape):\n    def __init__(self, w, h): self.w, self.h = w, h\n    def area(self): return self.w * self.h\n\n# Polymorphism — same method, different behavior\nshapes = [Circle(5), Rectangle(4, 6), Circle(3)]\nfor shape in shapes:\n    print(f'Area: {shape.area():.2f}')\n\n# Magic methods\nc1, c2 = Circle(3), Circle(4)\nc3 = c1 + c2       # Uses __add__\nprint(c3.r)        # 7", "python"),
             )},
            {"number": 5, "title": "OOP Project: Student Management System", "minutes": 45,
             "content": blocks(
                 heading("Building a Full Student Management System"),
                 code("class Person:\n    def __init__(self, name, email):\n        self.name = name\n        self.email = email\n\nclass Student(Person):\n    def __init__(self, name, email, student_id):\n        super().__init__(name, email)\n        self.student_id = student_id\n        self.grades = {}  # {subject: grade}\n    \n    def add_grade(self, subject, grade):\n        self.grades[subject] = grade\n    \n    def gpa(self):\n        if not self.grades: return 0.0\n        return round(sum(self.grades.values()) / len(self.grades), 2)\n    \n    def __repr__(self):\n        return f'Student({self.name}, GPA={self.gpa()})'\n\nclass ClassRoster:\n    def __init__(self, class_name):\n        self.class_name = class_name\n        self.students = []\n    \n    def add_student(self, student):\n        self.students.append(student)\n    \n    def top_student(self):\n        return max(self.students, key=lambda s: s.gpa())\n    \n    def class_average(self):\n        return round(sum(s.gpa() for s in self.students) / len(self.students), 2)\n\n# Usage\nroster = ClassRoster('CS-101')\ns1 = Student('Alice', 'alice@uni.edu', 'STU001')\ns1.add_grade('Math', 90)\ns1.add_grade('Python', 95)\ns2 = Student('Bob', 'bob@uni.edu', 'STU002')\ns2.add_grade('Math', 75)\ns2.add_grade('Python', 80)\nroster.add_student(s1)\nroster.add_student(s2)\nprint(roster.top_student())  # Student(Alice, GPA=92.5)\nprint(roster.class_average())  # 83.75", "python"),
             )},
        ],
        "quiz": [
            {"question": "What is __init__ used for?", "options": ["To delete an object", "To initialize an object's attributes when created", "To print the object", "To inherit from a parent class"], "correct": 1, "explanation": "__init__ is the constructor — it runs automatically when a new object is created."},
            {"question": "What does super() do in inheritance?", "options": ["Deletes the parent class", "Creates a new object", "Calls the parent class's methods", "Makes a method private"], "correct": 2, "explanation": "super() gives access to the parent class's methods and __init__."},
            {"question": "What is encapsulation?", "options": ["Inheriting from multiple classes", "Hiding internal data and exposing only necessary interfaces", "Writing functions in a loop", "Creating copies of objects"], "correct": 1, "explanation": "Encapsulation bundles data and methods together and restricts direct access to some components."},
            {"question": "Which decorator creates a getter property?", "options": ["@staticmethod", "@classmethod", "@property", "@getter"], "correct": 2, "explanation": "@property turns a method into an attribute-like getter."},
            {"question": "What is polymorphism?", "options": ["Multiple inheritance", "One interface, multiple implementations", "Creating private variables", "The __init__ method"], "correct": 1, "explanation": "Polymorphism allows different classes to be used through the same interface (method names), with each implementing behavior differently."},
        ]
    },
    {
        "number": 6, "title": "File Handling & Exceptions", "description": "Read, write files and handle errors gracefully.", "hours": 4,
        "lessons": [
            {"number": 1, "title": "Reading and Writing Files", "minutes": 25,
             "content": blocks(
                 heading("Working with Files in Python"),
                 code("# Writing to a file (creates if doesn't exist)\nwith open('students.txt', 'w') as f:\n    f.write('Alice, 90\\n')\n    f.write('Bob, 75\\n')\n    f.write('Charlie, 88\\n')\n\n# Reading entire file\nwith open('students.txt', 'r') as f:\n    content = f.read()\n    print(content)\n\n# Reading line by line (memory efficient for large files)\nwith open('students.txt', 'r') as f:\n    for line in f:\n        name, score = line.strip().split(', ')\n        print(f'{name}: {int(score) >= 80 and \"Pass\" or \"Fail\"}')\n\n# Append mode\nwith open('students.txt', 'a') as f:\n    f.write('Diana, 95\\n')", "python"),
                 tip("Always use 'with open()' (context manager) instead of just open(). It automatically closes the file even if an error occurs."),
             )},
            {"number": 2, "title": "CSV and JSON Files", "minutes": 20,
             "content": blocks(
                 heading("Structured Data Files"),
                 code("import csv\nimport json\n\n# Writing CSV\nstudents = [('Alice', 90, 'A'), ('Bob', 75, 'B')]\nwith open('grades.csv', 'w', newline='') as f:\n    writer = csv.writer(f)\n    writer.writerow(['Name', 'Score', 'Grade'])  # header\n    writer.writerows(students)\n\n# Reading CSV\nwith open('grades.csv', 'r') as f:\n    reader = csv.DictReader(f)\n    for row in reader:\n        print(f\"{row['Name']}: {row['Score']}\")\n\n# JSON — perfect for complex data\ndata = {'students': [{'name': 'Alice', 'gpa': 3.8}]}\nwith open('data.json', 'w') as f:\n    json.dump(data, f, indent=2)  # Pretty-print\n\nwith open('data.json', 'r') as f:\n    loaded = json.load(f)\n    print(loaded['students'][0]['name'])  # Alice", "python"),
             )},
            {"number": 3, "title": "Exception Handling", "minutes": 25,
             "content": blocks(
                 heading("Handling Errors Gracefully"),
                 text("Errors (exceptions) happen — files don't exist, users type wrong input, network fails. Exception handling lets your program recover gracefully instead of crashing."),
                 code("# Basic try-except\ntry:\n    x = int(input('Enter a number: '))\n    result = 10 / x\n    print(f'Result: {result}')\nexcept ValueError:\n    print('That is not a valid number!')\nexcept ZeroDivisionError:\n    print('Cannot divide by zero!')\nexcept Exception as e:\n    print(f'Unexpected error: {e}')\nelse:\n    print('Success!')   # Runs only if no exception\nfinally:\n    print('This ALWAYS runs')   # Cleanup code\n\n# Raising custom exceptions\ndef validate_age(age):\n    if age < 0 or age > 150:\n        raise ValueError(f'Invalid age: {age}')\n    return age\n\ntry:\n    validate_age(-5)\nexcept ValueError as e:\n    print(e)   # Invalid age: -5", "python"),
                 tip("Catch specific exceptions (ValueError, FileNotFoundError) rather than bare except:. Bare except: also catches keyboard interrupts (Ctrl+C) and system exits."),
             )},
            {"number": 4, "title": "Context Managers", "minutes": 15,
             "content": blocks(
                 heading("Managing Resources Safely"),
                 code("# Custom context manager using class\nclass DatabaseConnection:\n    def __enter__(self):\n        print('Connecting to database...')\n        return self\n    \n    def __exit__(self, exc_type, exc_val, exc_tb):\n        print('Closing database connection.')\n        return False   # Don't suppress exceptions\n    \n    def query(self, sql):\n        return f'Results for: {sql}'\n\nwith DatabaseConnection() as db:\n    result = db.query('SELECT * FROM students')\n    print(result)\n\n# Using contextlib\nfrom contextlib import contextmanager\n\n@contextmanager\ndef timer():\n    import time\n    start = time.time()\n    yield\n    elapsed = time.time() - start\n    print(f'Time elapsed: {elapsed:.3f}s')\n\nwith timer():\n    sum(range(1_000_000))", "python"),
             )},
            {"number": 5, "title": "File Project: Expense Tracker", "minutes": 40,
             "content": blocks(
                 heading("Project: Build an Expense Tracker"),
                 code("import json\nimport os\nfrom datetime import datetime\n\nDATA_FILE = 'expenses.json'\n\ndef load_expenses():\n    if os.path.exists(DATA_FILE):\n        with open(DATA_FILE) as f:\n            return json.load(f)\n    return []\n\ndef save_expenses(expenses):\n    with open(DATA_FILE, 'w') as f:\n        json.dump(expenses, f, indent=2)\n\ndef add_expense(category, amount, description):\n    expenses = load_expenses()\n    expenses.append({\n        'date': datetime.now().strftime('%Y-%m-%d'),\n        'category': category,\n        'amount': float(amount),\n        'description': description\n    })\n    save_expenses(expenses)\n    print(f'Added: {category} - ₹{amount:.2f}')\n\ndef total_by_category():\n    expenses = load_expenses()\n    totals = {}\n    for e in expenses:\n        totals[e['category']] = totals.get(e['category'], 0) + e['amount']\n    for cat, total in sorted(totals.items()):\n        print(f'{cat}: ₹{total:.2f}')\n\nadd_expense('Food', 250, 'Lunch')\nadd_expense('Transport', 50, 'Bus')\nadd_expense('Food', 150, 'Dinner')\ntotal_by_category()\n# Food: ₹400.00\n# Transport: ₹50.00", "python"),
                 tip("This is a portfolio-worthy project! Add features: budget limits per category, monthly reports, chart visualization with matplotlib."),
             )},
        ],
        "quiz": [
            {"question": "What file mode opens a file for appending?", "options": ["'r'", "'w'", "'a'", "'x'"], "correct": 2, "explanation": "'a' mode opens the file and adds content at the end without deleting existing content."},
            {"question": "What does the finally block do?", "options": ["Runs only if an exception occurs", "Runs only if no exception occurs", "Always runs, regardless of exceptions", "Catches all exceptions"], "correct": 2, "explanation": "finally always executes — perfect for cleanup like closing files or database connections."},
            {"question": "Which module handles JSON in Python?", "options": ["csv", "json", "pickle", "struct"], "correct": 1, "explanation": "Python's built-in json module provides json.load(), json.dump(), json.loads(), and json.dumps()."},
            {"question": "What exception does int('abc') raise?", "options": ["TypeError", "ValueError", "SyntaxError", "AttributeError"], "correct": 1, "explanation": "Converting a non-numeric string to int raises a ValueError."},
            {"question": "Why use 'with open()' instead of just open()?", "options": ["It's faster", "It automatically closes the file", "It opens in binary mode", "It prevents writing"], "correct": 1, "explanation": "The with statement (context manager) guarantees the file is closed even if an exception occurs."},
        ]
    },
    {
        "number": 7, "title": "Python Libraries", "description": "Use Python's powerful standard library and introduction to NumPy.", "hours": 4,
        "lessons": [
            {"number": 1, "title": "math and random Modules", "minutes": 15,
             "content": blocks(
                 heading("Built-in math and random Modules"),
                 code("import math\nimport random\n\n# math module\nprint(math.pi)           # 3.14159265...\nprint(math.sqrt(16))     # 4.0\nprint(math.ceil(4.1))    # 5\nprint(math.floor(4.9))   # 4\nprint(math.log(100, 10)) # 2.0\nprint(math.factorial(5)) # 120\n\n# random module\nprint(random.random())            # 0.0 to 1.0\nprint(random.randint(1, 6))       # Dice roll: 1-6\nprint(random.choice(['A','B','C']))  # Random choice\nnums = [1,2,3,4,5]\nrandom.shuffle(nums)              # Shuffle in place\nprint(nums)\nprint(random.sample(nums, 3))     # 3 random unique items", "python"),
             )},
            {"number": 2, "title": "datetime Module", "minutes": 15,
             "content": blocks(
                 heading("Working with Dates and Times"),
                 code("from datetime import datetime, date, timedelta\n\n# Current date and time\nnow = datetime.now()\nprint(now)                         # 2024-01-15 14:30:25.123456\nprint(now.strftime('%d %B %Y'))    # 15 January 2024\n\n# Date arithmetic\nbirthday = date(2003, 8, 15)\ntoday = date.today()\nage = (today - birthday).days // 365\nprint(f'Age: {age} years')\n\n# Add/subtract time\ndeadline = datetime.now() + timedelta(days=30)\nprint(f'Deadline: {deadline.strftime(\"%Y-%m-%d\")}')\n\n# Parse string to datetime\ndob = datetime.strptime('15/08/2003', '%d/%m/%Y')\nprint(dob.year)   # 2003", "python"),
             )},
            {"number": 3, "title": "os and sys Modules", "minutes": 15,
             "content": blocks(
                 heading("System and OS Operations"),
                 code("import os\nimport sys\n\n# File system operations\nprint(os.getcwd())              # Current directory\nos.makedirs('data', exist_ok=True)  # Create directory\nprint(os.listdir('.'))          # List files\nprint(os.path.exists('data'))   # True\nprint(os.path.join('data', 'file.txt'))  # data/file.txt\nos.rename('old.txt', 'new.txt') # Rename file\nos.remove('new.txt')            # Delete file\n\n# Environment variables\npath = os.environ.get('PATH', '')\ndb_url = os.environ.get('DATABASE_URL', 'sqlite:///dev.db')\n\n# sys module\nprint(sys.version)  # Python version\nprint(sys.argv)     # Command-line arguments", "python"),
             )},
            {"number": 4, "title": "collections Module", "minutes": 20,
             "content": blocks(
                 heading("Advanced Data Structures with collections"),
                 code("from collections import Counter, defaultdict, OrderedDict, deque\n\n# Counter — count occurrences automatically\nwords = 'the cat sat on the mat the cat'.split()\ncount = Counter(words)\nprint(count)          # Counter({'the': 3, 'cat': 2, ...})\nprint(count.most_common(2))  # [('the',3),('cat',2)]\n\n# defaultdict — no KeyError for missing keys\nword_positions = defaultdict(list)\nfor i, word in enumerate(words):\n    word_positions[word].append(i)\nprint(dict(word_positions))  # {'the': [0,4,6], ...}\n\n# deque — efficient append/pop from both ends\nqueue = deque(['a', 'b', 'c'])\nqueue.append('d')      # Add right\nqueue.appendleft('z')  # Add left\nqueue.popleft()        # Remove from left: 'z'\nprint(list(queue))     # ['a', 'b', 'c', 'd']", "python"),
             )},
            {"number": 5, "title": "Introduction to NumPy", "minutes": 30,
             "content": blocks(
                 heading("NumPy — Numerical Computing"),
                 text("NumPy is Python's most important numerical library. It provides n-dimensional arrays (ndarray) that are much faster than Python lists for numerical operations. It's the foundation of Pandas, SciPy, TensorFlow, and most scientific Python packages."),
                 code("import numpy as np\n\n# Creating arrays\na = np.array([1, 2, 3, 4, 5])\nb = np.zeros((3, 3))    # 3x3 matrix of zeros\nc = np.ones((2, 4))     # 2x4 matrix of ones\nd = np.arange(0, 10, 2) # [0, 2, 4, 6, 8]\ne = np.linspace(0, 1, 5) # [0., 0.25, 0.5, 0.75, 1.]\n\n# Array operations (element-wise, NO loops needed!)\nprint(a * 2)      # [2, 4, 6, 8, 10]\nprint(a + a)      # [2, 4, 6, 8, 10]\nprint(a ** 2)     # [1, 4, 9, 16, 25]\n\n# Array statistics\nprint(a.mean())   # 3.0\nprint(a.std())    # 1.414...\nprint(a.max())    # 5\nprint(np.sum(a))  # 15\n\n# 2D arrays (matrices)\nmatrix = np.array([[1,2],[3,4],[5,6]])\nprint(matrix.shape)   # (3, 2)\nprint(matrix.T)       # Transpose: (2, 3)", "python"),
                 tip("NumPy operations are 100-1000x faster than Python lists for large data. pip install numpy to get started."),
             )},
        ],
        "quiz": [
            {"question": "Which module provides the sqrt() function?", "options": ["random", "os", "math", "sys"], "correct": 2, "explanation": "math.sqrt() computes square roots. import math first."},
            {"question": "What does Counter() from collections do?", "options": ["Counts loop iterations", "Counts occurrences of elements", "Counts dictionary keys", "Creates a countdown timer"], "correct": 1, "explanation": "Counter takes an iterable and returns a dict-like object mapping elements to their count."},
            {"question": "What does os.path.join('data', 'file.txt') return on Windows?", "options": ["data/file.txt", "data\\file.txt", "data+file.txt", "datafile.txt"], "correct": 1, "explanation": "os.path.join uses the OS-appropriate separator. On Windows it's backslash, on Linux/Mac it's forward slash."},
            {"question": "What is the advantage of NumPy arrays over Python lists?", "options": ["They can store strings", "They are much faster for numerical operations", "They are easier to create", "They automatically sort"], "correct": 1, "explanation": "NumPy arrays are backed by C, so numerical operations are 100-1000x faster than pure Python lists."},
            {"question": "What does deque stand for?", "options": ["Data Queue", "Double-Ended Queue", "Decrement Queue", "Default Queue"], "correct": 1, "explanation": "deque is a Double-Ended Queue — it supports O(1) append and pop from both ends."},
        ]
    },
    {
        "number": 8, "title": "Projects and Final Assessment", "description": "Apply everything by building 4 real-world projects.", "hours": 8,
        "lessons": [
            {"number": 1, "title": "Project 1: Number Guessing Game", "minutes": 30,
             "content": blocks(
                 heading("Project: Number Guessing Game"),
                 text("We'll build a complete number guessing game with difficulty levels, attempt tracking, hints, and high score saving. This exercises: loops, conditionals, functions, random module, and file handling."),
                 code("import random\nimport json\nimport os\n\nSCORES_FILE = 'high_scores.json'\n\ndef load_scores():\n    if os.path.exists(SCORES_FILE):\n        with open(SCORES_FILE) as f:\n            return json.load(f)\n    return {}\n\ndef save_score(name, attempts, difficulty):\n    scores = load_scores()\n    key = f'{name}_{difficulty}'\n    if key not in scores or scores[key] > attempts:\n        scores[key] = attempts\n        with open(SCORES_FILE, 'w') as f:\n            json.dump(scores, f)\n        print(f'🏆 New record: {attempts} attempts!')\n\ndef play_game():\n    name = input('Enter your name: ')\n    print('\\nDifficulty: 1=Easy(1-10) 2=Medium(1-50) 3=Hard(1-100)')\n    diff = int(input('Choose: '))\n    ranges = {1: 10, 2: 50, 3: 100}\n    max_num = ranges.get(diff, 50)\n    \n    secret = random.randint(1, max_num)\n    attempts = 0\n    \n    print(f'\\nGuess a number between 1 and {max_num}!')\n    while True:\n        try:\n            guess = int(input('Your guess: '))\n            attempts += 1\n            if guess < secret:\n                print('📉 Too low! Higher!')\n            elif guess > secret:\n                print('📈 Too high! Lower!')\n            else:\n                print(f'🎉 Correct in {attempts} attempts!')\n                save_score(name, attempts, diff)\n                break\n        except ValueError:\n            print('Please enter a valid number')\n    return attempts\n\nplay_game()", "python"),
             )},
            {"number": 2, "title": "Project 2: Calculator with OOP", "minutes": 35,
             "content": blocks(
                 heading("Project: OOP Calculator"),
                 code("class Calculator:\n    def __init__(self):\n        self.history = []\n    \n    def _record(self, expression, result):\n        self.history.append(f'{expression} = {result}')\n        return result\n    \n    def add(self, a, b):\n        return self._record(f'{a}+{b}', a + b)\n    \n    def subtract(self, a, b):\n        return self._record(f'{a}-{b}', a - b)\n    \n    def multiply(self, a, b):\n        return self._record(f'{a}*{b}', a * b)\n    \n    def divide(self, a, b):\n        if b == 0:\n            raise ZeroDivisionError('Cannot divide by zero')\n        return self._record(f'{a}/{b}', round(a / b, 4))\n    \n    def power(self, a, b):\n        return self._record(f'{a}^{b}', a ** b)\n    \n    def show_history(self):\n        if not self.history:\n            print('No calculations yet.')\n        for i, entry in enumerate(self.history, 1):\n            print(f'{i}. {entry}')\n    \n    def run(self):\n        ops = {'+': self.add, '-': self.subtract,\n               '*': self.multiply, '/': self.divide, '^': self.power}\n        print('=== OOP Calculator ===')\n        while True:\n            expr = input('Enter (e.g. 5 + 3) or h=history, q=quit: ')\n            if expr.lower() == 'q': break\n            if expr.lower() == 'h': self.show_history(); continue\n            try:\n                parts = expr.split()\n                a, op, b = float(parts[0]), parts[1], float(parts[2])\n                print(f'  = {ops[op](a, b)}')\n            except Exception as e:\n                print(f'Error: {e}')\n\nCalculator().run()", "python"),
             )},
            {"number": 3, "title": "Project 3: Student Grade Manager", "minutes": 40,
             "content": blocks(
                 heading("Project: Complete Grade Management System"),
                 code("import csv\nfrom dataclasses import dataclass, field\nfrom typing import List\n\n@dataclass\nclass Subject:\n    name: str\n    marks: List[float] = field(default_factory=list)\n    \n    @property\n    def average(self): return sum(self.marks)/len(self.marks) if self.marks else 0\n    @property  \n    def grade(self):\n        avg = self.average\n        if avg >= 90: return 'A+'\n        elif avg >= 80: return 'A'\n        elif avg >= 70: return 'B'\n        elif avg >= 60: return 'C'\n        return 'F'\n\n@dataclass\nclass Student:\n    roll_number: str\n    name: str\n    subjects: List[Subject] = field(default_factory=list)\n    \n    def add_marks(self, subject_name, marks):\n        for s in self.subjects:\n            if s.name == subject_name:\n                s.marks.append(marks)\n                return\n        subj = Subject(subject_name, [marks])\n        self.subjects.append(subj)\n    \n    @property\n    def overall_gpa(self):\n        avgs = [s.average for s in self.subjects if s.marks]\n        return round(sum(avgs)/len(avgs), 2) if avgs else 0\n    \n    def report(self):\n        print(f'\\n=== Report Card: {self.name} ({self.roll_number}) ===')\n        for s in self.subjects:\n            print(f'  {s.name:15} Avg: {s.average:5.1f}  Grade: {s.grade}')\n        print(f'  Overall GPA: {self.overall_gpa:.2f}')\n\nstudent = Student('STU001', 'Venkatesh')\nstudent.add_marks('Mathematics', 88)\nstudent.add_marks('Mathematics', 92)\nstudent.add_marks('Python', 95)\nstudent.add_marks('Python', 98)\nstudent.add_marks('Data Science', 85)\nstudent.report()", "python"),
             )},
            {"number": 4, "title": "Project 4: Data Analysis Script", "minutes": 40,
             "content": blocks(
                 heading("Project: Mini Data Analysis Tool"),
                 code("# Analyze CSV sales data without pandas\nimport csv\nfrom collections import defaultdict\n\ndef analyze_sales(filename):\n    totals = defaultdict(float)\n    counts = defaultdict(int)\n    \n    with open(filename, 'r') as f:\n        reader = csv.DictReader(f)\n        for row in reader:\n            product = row['product']\n            amount = float(row['amount'])\n            totals[product] += amount\n            counts[product] += 1\n    \n    print('Sales Report')\n    print('=' * 40)\n    for product in sorted(totals.keys()):\n        avg = totals[product] / counts[product]\n        print(f'{product:20} Total: ₹{totals[product]:8.2f}  Avg: ₹{avg:.2f}')\n    \n    best = max(totals, key=totals.get)\n    print(f'\\nBest seller: {best} (₹{totals[best]:.2f})')\n\n# Create sample CSV first\nwith open('sales.csv', 'w', newline='') as f:\n    csv.writer(f).writerows([\n        ['product', 'amount'],\n        ['Python Book', 499], ['Python Book', 499],\n        ['SQL Course', 999], ['SQL Course', 999], ['SQL Course', 999],\n        ['Data Kit', 1499], ['Data Kit', 1499],\n    ])\n\nanalyze_sales('sales.csv')", "python"),
             )},
            {"number": 5, "title": "Final Course Assessment", "minutes": 60,
             "content": blocks(
                 heading("Python Programming — Final Assessment"),
                 text("Congratulations on completing the Python Programming course! This final assessment covers all 8 modules. Take your time, apply everything you've learned. The quiz below contains 30 questions from all modules."),
                 lst("Module 1: Python Fundamentals — Variables, Data Types, Operators",
                     "Module 2: Control Flow — if statements, for/while loops",
                     "Module 3: Data Structures — Lists, Tuples, Sets, Dicts",
                     "Module 4: Functions — def, *args, **kwargs, recursion, lambda",
                     "Module 5: OOP — Classes, Inheritance, Encapsulation",
                     "Module 6: File Handling — read/write, CSV, JSON, exceptions",
                     "Module 7: Libraries — math, datetime, os, collections, NumPy",
                     "Module 8: Projects — applied Python programming"),
                 tip("After this course, your next steps: 1) Practice on LeetCode/HackerRank 2) Learn Pandas for data analysis 3) Build a web app with Flask/Django 4) Explore Machine Learning with scikit-learn"),
                 example("Skills you've gained: Python syntax, data structures, OOP, file handling, modular programming, problem-solving. You are now job-ready for Python development roles!"),
             )},
        ],
        "quiz": [
            {"question": "Which project structure best demonstrates OOP?", "options": ["All code in one file with global variables", "Classes with attributes and methods, separated by responsibility", "Functions only, no classes", "One main() function that does everything"], "correct": 1, "explanation": "Good OOP separates concerns into classes with clear attributes and methods."},
            {"question": "What is the @dataclass decorator used for?", "options": ["Creating database models", "Automatically generating __init__, __repr__, and __eq__ for a class", "Decorating functions", "Making classes abstract"], "correct": 1, "explanation": "@dataclass auto-generates boilerplate methods like __init__ based on class variable annotations."},
            {"question": "What is the DRY principle?", "options": ["Debug Rapidly Young", "Don't Repeat Yourself", "Declare Return Yield", "Dynamic Runtime Yelling"], "correct": 1, "explanation": "DRY (Don't Repeat Yourself) means avoid duplicating code — extract repeated logic into functions."},
            {"question": "For building a web API, which Python framework would you use?", "options": ["numpy", "pandas", "FastAPI or Django", "math"], "correct": 2, "explanation": "FastAPI and Django/Flask are Python frameworks for building web APIs and applications."},
            {"question": "What should you build to get your first Python job?", "options": ["Nothing, just know syntax", "A portfolio with 3-5 real projects on GitHub", "Only study theory", "Copy tutorial projects exactly"], "correct": 1, "explanation": "A portfolio of real, practical projects pushed to GitHub is the most effective way to land a Python development job."},
        ]
    }
]

# ─── SQL Course ───────────────────────────────────────────────────────────────

SQL_MODULES = [
    {
        "number": 1, "title": "Introduction to Databases", "description": "Learn what databases are and how to design them.", "hours": 3,
        "lessons": [
            {"number": 1, "title": "What is a Database?", "minutes": 20,
             "content": blocks(
                 heading("Databases — Organized Data Storage"),
                 text("A database is an organized collection of structured data stored electronically. A Database Management System (DBMS) is software that manages databases — allowing you to create, read, update, and delete data. Examples: MySQL, PostgreSQL, SQLite, Oracle, Microsoft SQL Server."),
                 lst("Relational (SQL) databases: MySQL, PostgreSQL, SQLite, SQL Server — data in tables with relationships",
                     "NoSQL databases: MongoDB, Redis, DynamoDB — flexible schemas (documents, key-value, graphs)",
                     "SQL (Structured Query Language) is the standard language for relational databases",
                     "CRUD: Create, Read, Update, Delete — the 4 basic database operations"),
                 example("Real-world: Every app you use has a database. Instagram stores photos, likes, followers in PostgreSQL. WhatsApp messages in a distributed database. Your bank account balance in Oracle."),
                 tip("SQLite is a great learning database — no installation needed, just a single file. Python includes sqlite3 in the standard library!"),
             )},
            {"number": 2, "title": "Tables, Rows, and Columns", "minutes": 20,
             "content": blocks(
                 heading("Relational Database Structure"),
                 text("In a relational database, data is organized into tables (also called relations). Each table has: Columns (fields) that define the data structure, and Rows (records/tuples) that contain actual data values."),
                 code("-- A students table\nCREATE TABLE students (\n    id          INTEGER PRIMARY KEY AUTOINCREMENT,\n    name        TEXT NOT NULL,\n    email       TEXT UNIQUE NOT NULL,\n    age         INTEGER,\n    gpa         REAL DEFAULT 0.0,\n    enrolled_at DATE DEFAULT CURRENT_DATE\n);\n\n-- PRIMARY KEY: uniquely identifies each row\n-- NOT NULL: value is required\n-- UNIQUE: no two rows can have same value\n-- DEFAULT: value used if not specified", "sql"),
                 heading("Data Types in SQL"),
                 lst("INTEGER / INT — whole numbers: 1, 42, -5",
                     "REAL / FLOAT / DECIMAL — decimals: 3.14, 9.99",
                     "TEXT / VARCHAR / CHAR — strings: 'Alice', 'Mumbai'",
                     "BOOLEAN — true/false (stored as 0/1 in SQLite)",
                     "DATE / DATETIME — dates: '2024-01-15', '2024-01-15 10:30:00'",
                     "BLOB — binary data (images, files)"),
                 tip("Always define a PRIMARY KEY for every table. It ensures each row has a unique identifier and speeds up queries significantly."),
             )},
            {"number": 3, "title": "INSERT — Adding Data", "minutes": 20,
             "content": blocks(
                 heading("Inserting Records with INSERT INTO"),
                 code("-- Insert a single row\nINSERT INTO students (name, email, age, gpa)\nVALUES ('Alice Johnson', 'alice@uni.edu', 20, 3.8);\n\n-- Insert multiple rows at once\nINSERT INTO students (name, email, age, gpa) VALUES\n    ('Bob Smith', 'bob@uni.edu', 22, 3.5),\n    ('Charlie Davis', 'charlie@uni.edu', 21, 3.7),\n    ('Diana Prince', 'diana@uni.edu', 20, 3.9);\n\n-- Insert with all columns (must match order)\nINSERT INTO students VALUES\n    (NULL, 'Eve Wilson', 'eve@uni.edu', 23, 3.6, '2024-01-15');", "sql"),
                 warn("If you forget a NOT NULL column in INSERT, you'll get an error. Always specify column names in INSERT to avoid column order issues."),
             )},
            {"number": 4, "title": "Database Design: Keys and Relationships", "minutes": 25,
             "content": blocks(
                 heading("Designing Tables with Relationships"),
                 code("-- One-to-many: One student has many courses\nCREATE TABLE courses (\n    id    INTEGER PRIMARY KEY AUTOINCREMENT,\n    name  TEXT NOT NULL,\n    code  TEXT UNIQUE NOT NULL\n);\n\nCREATE TABLE enrollments (\n    id         INTEGER PRIMARY KEY AUTOINCREMENT,\n    student_id INTEGER NOT NULL REFERENCES students(id),\n    course_id  INTEGER NOT NULL REFERENCES courses(id),\n    grade      REAL,\n    enrolled   DATE DEFAULT CURRENT_DATE,\n    UNIQUE(student_id, course_id)  -- can't enroll twice\n);\n\n-- The FOREIGN KEY creates the relationship:\n-- student_id in enrollments POINTS TO id in students", "sql"),
                 tip("Normalization: split data into multiple related tables to avoid duplication. Store student name ONCE in students table, reference it by ID everywhere else."),
             )},
            {"number": 5, "title": "SQLite with Python", "minutes": 25,
             "content": blocks(
                 heading("Using SQLite in Python"),
                 code("import sqlite3\n\n# Connect (creates file if doesn't exist)\nconn = sqlite3.connect('school.db')\ncursor = conn.cursor()\n\n# Create table\ncursor.execute('''\n    CREATE TABLE IF NOT EXISTS students (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        name TEXT NOT NULL,\n        gpa REAL\n    )\n''')\n\n# Insert data (use ? for parameterized queries!)\nstudents = [('Alice', 3.8), ('Bob', 3.5), ('Charlie', 3.9)]\ncursor.executemany('INSERT INTO students (name, gpa) VALUES (?, ?)', students)\n\n# Query\nfor row in cursor.execute('SELECT * FROM students ORDER BY gpa DESC'):\n    print(row)\n# (3, 'Charlie', 3.9)\n# (1, 'Alice', 3.8)\n# (2, 'Bob', 3.5)\n\nconn.commit()  # Save changes\nconn.close()", "python"),
                 warn("NEVER use string formatting (f-strings) to build SQL queries — it enables SQL injection attacks! Always use parameterized queries with ? placeholders."),
             )},
        ],
        "quiz": [
            {"question": "What is a PRIMARY KEY?", "options": ["The first column in a table", "A column that uniquely identifies each row", "A foreign reference to another table", "An optional column"], "correct": 1, "explanation": "PRIMARY KEY ensures each row has a unique, non-null identifier for fast lookups and relationships."},
            {"question": "What does FOREIGN KEY establish?", "options": ["A sorted index", "A relationship between two tables", "A unique constraint", "A default value"], "correct": 1, "explanation": "FOREIGN KEY creates a link between two tables, enforcing referential integrity."},
            {"question": "Which SQL data type stores decimal numbers?", "options": ["TEXT", "INTEGER", "REAL or DECIMAL", "BOOLEAN"], "correct": 2, "explanation": "REAL (or FLOAT/DECIMAL) stores numbers with decimal points like 3.14 or 9.99."},
            {"question": "Why use parameterized queries in Python?", "options": ["They are faster to type", "They prevent SQL injection attacks", "They only work with SQLite", "They auto-format results"], "correct": 1, "explanation": "Parameterized queries treat user input as data, not SQL code, preventing SQL injection vulnerabilities."},
            {"question": "What does AUTOINCREMENT do?", "options": ["Automatically updates column on each change", "Automatically assigns the next integer ID", "Creates a timestamp", "Creates an index"], "correct": 1, "explanation": "AUTOINCREMENT generates a unique incrementing integer for each new row — perfect for primary keys."},
        ]
    },
    {
        "number": 2, "title": "SELECT Queries", "description": "Master the SELECT statement to retrieve and filter data.", "hours": 4,
        "lessons": [
            {"number": 1, "title": "Basic SELECT and WHERE", "minutes": 25,
             "content": blocks(
                 heading("Retrieving Data with SELECT"),
                 code("-- Select all columns\nSELECT * FROM students;\n\n-- Select specific columns\nSELECT name, gpa FROM students;\n\n-- WHERE clause for filtering\nSELECT name, gpa FROM students WHERE gpa >= 3.5;\n\n-- Multiple conditions\nSELECT * FROM students\n    WHERE age >= 20 AND gpa > 3.0;\n\nSELECT * FROM students\n    WHERE department = 'CS' OR department = 'IT';\n\n-- NOT operator\nSELECT * FROM students WHERE NOT gpa < 3.0;\n\n-- BETWEEN (inclusive)\nSELECT * FROM students WHERE age BETWEEN 18 AND 22;\n\n-- IN operator (multiple values)\nSELECT * FROM students\n    WHERE department IN ('CS', 'IT', 'ECE');", "sql"),
             )},
            {"number": 2, "title": "LIKE, IS NULL, ORDER BY, LIMIT", "minutes": 25,
             "content": blocks(
                 heading("Advanced Filtering and Sorting"),
                 code("-- LIKE for pattern matching\n-- % = any characters, _ = one character\nSELECT * FROM students WHERE name LIKE 'A%';     -- Starts with A\nSELECT * FROM students WHERE email LIKE '%@gmail.com';  -- Gmail\nSELECT * FROM students WHERE name LIKE '__n%';   -- 3rd char is n\n\n-- IS NULL / IS NOT NULL\nSELECT * FROM students WHERE gpa IS NULL;          -- No GPA set\nSELECT * FROM students WHERE phone IS NOT NULL;    -- Has phone\n\n-- ORDER BY for sorting\nSELECT * FROM students ORDER BY gpa DESC;          -- Highest first\nSELECT * FROM students ORDER BY name ASC;          -- Alphabetical\nSELECT * FROM students ORDER BY department, gpa DESC; -- Multi-sort\n\n-- LIMIT and OFFSET for pagination\nSELECT * FROM students ORDER BY gpa DESC LIMIT 10;        -- Top 10\nSELECT * FROM students ORDER BY gpa DESC LIMIT 10 OFFSET 10; -- Page 2\n\n-- DISTINCT — remove duplicates\nSELECT DISTINCT department FROM students;", "sql"),
                 tip("Pagination pattern: page 1 = LIMIT 10 OFFSET 0, page 2 = LIMIT 10 OFFSET 10. This is how Instagram loads photos 12 at a time."),
             )},
            {"number": 3, "title": "Aliases and Column Expressions", "minutes": 15,
             "content": blocks(
                 heading("Column Aliases and Computed Values"),
                 code("-- Column aliases with AS\nSELECT\n    name AS student_name,\n    gpa AS grade_point_average,\n    age * 365 AS age_in_days   -- Computed column\nFROM students;\n\n-- String functions\nSELECT\n    UPPER(name) AS name_upper,\n    LENGTH(name) AS name_length,\n    SUBSTR(email, 1, INSTR(email,'@')-1) AS username\nFROM students;\n\n-- COALESCE — handle NULL values\nSELECT\n    name,\n    COALESCE(phone, 'No phone') AS contact\nFROM students;", "sql"),
             )},
            {"number": 4, "title": "CASE Expressions", "minutes": 15,
             "content": blocks(
                 heading("Conditional Logic with CASE"),
                 code("-- CASE is SQL's if-else\nSELECT\n    name,\n    gpa,\n    CASE\n        WHEN gpa >= 9.0 THEN 'Outstanding'\n        WHEN gpa >= 8.0 THEN 'Excellent'\n        WHEN gpa >= 7.0 THEN 'Good'\n        WHEN gpa >= 6.0 THEN 'Average'\n        ELSE 'Below Average'\n    END AS performance\nFROM students\nORDER BY gpa DESC;\n\n-- Simple CASE\nSELECT\n    name,\n    CASE department\n        WHEN 'CS' THEN 'Computer Science'\n        WHEN 'IT' THEN 'Information Technology'\n        ELSE 'Other'\n    END AS dept_full_name\nFROM students;", "sql"),
             )},
            {"number": 5, "title": "Query Practice: Student Database", "minutes": 30,
             "content": blocks(
                 heading("Practice: 10 Essential Queries"),
                 code("-- Setup: Sample student database\nCREATE TABLE students (\n    id INTEGER PRIMARY KEY, name TEXT, dept TEXT, gpa REAL, year INTEGER\n);\nINSERT INTO students VALUES\n    (1,'Alice','CS',3.9,2),(2,'Bob','IT',3.2,3),(3,'Charlie','CS',3.7,1),\n    (4,'Diana','ECE',3.8,2),(5,'Eve','CS',2.9,4),(6,'Frank','IT',3.5,2);\n\n-- Q1: All CS students sorted by GPA\nSELECT name, gpa FROM students WHERE dept='CS' ORDER BY gpa DESC;\n\n-- Q2: Students with GPA above department average (subquery preview)\nSELECT name, dept, gpa FROM students WHERE gpa > 3.5;\n\n-- Q3: Students whose name starts with 'C' or 'D'\nSELECT * FROM students WHERE name LIKE 'C%' OR name LIKE 'D%';\n\n-- Q4: Rank by GPA, show grade\nSELECT name, gpa,\n    CASE WHEN gpa>=3.7 THEN 'A' WHEN gpa>=3.3 THEN 'B' ELSE 'C' END grade\nFROM students ORDER BY gpa DESC;", "sql"),
             )},
        ],
        "quiz": [
            {"question": "What does SELECT * do?", "options": ["Selects only the first column", "Selects all columns", "Selects the primary key", "Counts all rows"], "correct": 1, "explanation": "* is a wildcard that selects all columns from the table."},
            {"question": "What does LIKE 'A%' match?", "options": ["Strings ending in A", "Strings starting with A", "Strings containing exactly A", "Strings with A as second character"], "correct": 1, "explanation": "% matches any sequence of characters. 'A%' matches anything starting with A."},
            {"question": "What is the purpose of ORDER BY?", "options": ["Filter rows", "Sort the results", "Remove duplicates", "Limit rows returned"], "correct": 1, "explanation": "ORDER BY sorts query results by one or more columns in ASC (default) or DESC order."},
            {"question": "What does LIMIT 5 OFFSET 10 do?", "options": ["Returns first 15 rows", "Returns rows 11-15", "Returns 5 rows starting from row 11", "Returns row 10 only"], "correct": 2, "explanation": "LIMIT 5 OFFSET 10 skips 10 rows and returns the next 5 (rows 11, 12, 13, 14, 15)."},
            {"question": "What does DISTINCT do?", "options": ["Sorts values", "Removes duplicate rows from results", "Makes column names unique", "Creates unique indexes"], "correct": 1, "explanation": "DISTINCT eliminates duplicate rows from the result set."},
        ]
    },
    {
        "number": 3, "title": "Aggregations and Grouping", "description": "Summarize data with GROUP BY and aggregate functions.", "hours": 4,
        "lessons": [
            {"number": 1, "title": "Aggregate Functions", "minutes": 20,
             "content": blocks(
                 heading("Summarizing Data with Aggregate Functions"),
                 code("-- COUNT, SUM, AVG, MAX, MIN\nSELECT COUNT(*) AS total_students FROM students;        -- 100\nSELECT COUNT(gpa) AS students_with_gpa FROM students;   -- skips NULLs\nSELECT AVG(gpa) AS average_gpa FROM students;           -- 3.45\nSELECT MAX(gpa) AS highest_gpa FROM students;           -- 4.0\nSELECT MIN(age) AS youngest FROM students;              -- 18\nSELECT SUM(fees_paid) AS total_collected FROM students; -- 500000\n\n-- Combined stats\nSELECT\n    COUNT(*) AS total,\n    AVG(gpa) AS avg_gpa,\n    MAX(gpa) AS highest,\n    MIN(gpa) AS lowest\nFROM students WHERE dept = 'CS';", "sql"),
             )},
            {"number": 2, "title": "GROUP BY", "minutes": 25,
             "content": blocks(
                 heading("Grouping Rows with GROUP BY"),
                 code("-- Statistics per department\nSELECT\n    dept,\n    COUNT(*) AS student_count,\n    AVG(gpa) AS avg_gpa,\n    MAX(gpa) AS top_gpa\nFROM students\nGROUP BY dept\nORDER BY avg_gpa DESC;\n\n-- Dept  | count | avg_gpa | top_gpa\n-- CS    | 35    | 3.72    | 4.0\n-- IT    | 28    | 3.45    | 3.95\n-- ECE   | 25    | 3.61    | 3.98\n\n-- Group by multiple columns\nSELECT dept, year, COUNT(*) AS count, AVG(gpa) AS avg\nFROM students\nGROUP BY dept, year\nORDER BY dept, year;", "sql"),
                 tip("Only columns that are in GROUP BY or inside aggregate functions can appear in SELECT. This is the most common SQL mistake for beginners!"),
             )},
            {"number": 3, "title": "HAVING Clause", "minutes": 20,
             "content": blocks(
                 heading("Filtering Groups with HAVING"),
                 code("-- HAVING filters GROUPS (after grouping)\n-- WHERE filters ROWS (before grouping)\n\n-- Departments with average GPA above 3.5\nSELECT dept, AVG(gpa) AS avg_gpa\nFROM students\nGROUP BY dept\nHAVING AVG(gpa) > 3.5\nORDER BY avg_gpa DESC;\n\n-- Departments with more than 20 students AND avg GPA > 3.4\nSELECT dept, COUNT(*) AS total, AVG(gpa) AS avg\nFROM students\nGROUP BY dept\nHAVING COUNT(*) > 20 AND AVG(gpa) > 3.4;\n\n-- Difference: WHERE vs HAVING\n-- WHERE: applied BEFORE grouping — filters individual rows\n-- HAVING: applied AFTER grouping — filters aggregated groups\nSELECT dept, COUNT(*) FROM students\n    WHERE year >= 2  -- filter: only 2nd year and above\n    GROUP BY dept\n    HAVING COUNT(*) > 5;  -- filter: groups with >5 students", "sql"),
             )},
            {"number": 4, "title": "Subqueries", "minutes": 25,
             "content": blocks(
                 heading("Queries Within Queries — Subqueries"),
                 code("-- Scalar subquery: returns one value\nSELECT name, gpa\nFROM students\nWHERE gpa > (SELECT AVG(gpa) FROM students);  -- above average\n\n-- Subquery in FROM (derived table)\nSELECT dept, avg_gpa\nFROM (\n    SELECT dept, AVG(gpa) AS avg_gpa\n    FROM students\n    GROUP BY dept\n) AS dept_stats\nWHERE avg_gpa > 3.5;\n\n-- EXISTS subquery: check if related data exists\nSELECT s.name FROM students s\nWHERE EXISTS (\n    SELECT 1 FROM enrollments e WHERE e.student_id = s.id\n);\n\n-- IN with subquery\nSELECT name FROM students\nWHERE id IN (\n    SELECT student_id FROM enrollments WHERE course_id = 5\n);", "sql"),
             )},
            {"number": 5, "title": "Window Functions", "minutes": 25,
             "content": blocks(
                 heading("Advanced Analytics: Window Functions"),
                 code("-- Window functions perform calculations across related rows\n-- WITHOUT collapsing them into groups (unlike GROUP BY)\n\n-- ROW_NUMBER: rank each row within partition\nSELECT\n    name, dept, gpa,\n    ROW_NUMBER() OVER (PARTITION BY dept ORDER BY gpa DESC) AS rank_in_dept\nFROM students;\n\n-- RANK (allows ties, skips numbers)\nSELECT name, gpa,\n    RANK() OVER (ORDER BY gpa DESC) AS overall_rank\nFROM students;\n\n-- Running total\nSELECT\n    name, gpa,\n    SUM(gpa) OVER (ORDER BY gpa DESC) AS running_total\nFROM students;\n\n-- LAG and LEAD — access previous/next row\nSELECT\n    name, gpa,\n    LAG(gpa) OVER (ORDER BY gpa DESC) AS prev_gpa,\n    LEAD(gpa) OVER (ORDER BY gpa DESC) AS next_gpa\nFROM students;", "sql"),
                 tip("Window functions are one of SQL's most powerful features and frequently tested in data engineer/analyst interviews at top companies!"),
             )},
        ],
        "quiz": [
            {"question": "What does AVG(gpa) compute?", "options": ["Maximum GPA", "Minimum GPA", "Sum of all GPAs", "Arithmetic mean of all GPA values"], "correct": 3, "explanation": "AVG() returns the arithmetic mean (sum divided by count) of non-NULL values."},
            {"question": "What is the difference between WHERE and HAVING?", "options": ["No difference", "WHERE filters rows before grouping, HAVING filters groups after", "HAVING is faster", "WHERE works with aggregate functions"], "correct": 1, "explanation": "WHERE filters individual rows before GROUP BY runs. HAVING filters the aggregated groups after GROUP BY."},
            {"question": "Which function assigns ranks allowing ties?", "options": ["ROW_NUMBER()", "RANK()", "DENSE_RANK()", "COUNT()"], "correct": 1, "explanation": "RANK() assigns the same rank to ties but skips the next number. DENSE_RANK() assigns same rank without skipping."},
            {"question": "What does COUNT(*) count?", "options": ["Only non-NULL rows", "Only distinct values", "All rows including NULL", "Only numeric columns"], "correct": 2, "explanation": "COUNT(*) counts all rows including those with NULL. COUNT(column) skips NULLs."},
            {"question": "What is a subquery?", "options": ["A query that runs in parallel", "A query nested inside another query", "A query with multiple joins", "A stored procedure"], "correct": 1, "explanation": "A subquery is a SELECT statement nested inside another SELECT, INSERT, UPDATE, or DELETE statement."},
        ]
    },
    {
        "number": 4, "title": "JOINs", "description": "Combine data from multiple tables using SQL JOINs.", "hours": 5,
        "lessons": [
            {"number": 1, "title": "INNER JOIN", "minutes": 25,
             "content": blocks(
                 heading("Combining Tables with INNER JOIN"),
                 text("A JOIN combines columns from two or more related tables based on a matching condition. INNER JOIN returns only rows that have matching values in BOTH tables. Non-matching rows are excluded."),
                 code("-- Database schema\n-- students(id, name, dept_id)\n-- departments(id, name, head)\n-- courses(id, code, name, dept_id)\n-- enrollments(student_id, course_id, grade)\n\n-- INNER JOIN: students with their department names\nSELECT s.name, d.name AS department\nFROM students s\nINNER JOIN departments d ON s.dept_id = d.id;\n\n-- Multi-table JOIN: students → enrollments → courses\nSELECT s.name, c.code, c.name AS course, e.grade\nFROM students s\nINNER JOIN enrollments e ON e.student_id = s.id\nINNER JOIN courses c ON c.id = e.course_id\nWHERE e.grade >= 8.0\nORDER BY s.name, e.grade DESC;", "sql"),
                 tip("Always use table aliases (s, d, e) in JOINs to keep queries readable. Use ON to specify the join condition."),
             )},
            {"number": 2, "title": "LEFT JOIN and RIGHT JOIN", "minutes": 20,
             "content": blocks(
                 heading("Outer Joins — Include Non-Matching Rows"),
                 code("-- LEFT JOIN: ALL students, even those without enrollments\nSELECT s.name, COUNT(e.course_id) AS courses_enrolled\nFROM students s\nLEFT JOIN enrollments e ON e.student_id = s.id\nGROUP BY s.id, s.name\nORDER BY courses_enrolled DESC;\n\n-- Students with NO enrollments (NULL trick)\nSELECT s.name\nFROM students s\nLEFT JOIN enrollments e ON e.student_id = s.id\nWHERE e.student_id IS NULL;\n\n-- RIGHT JOIN: all courses, even those with no enrolled students\nSELECT c.name, COUNT(e.student_id) AS enrolled\nFROM enrollments e\nRIGHT JOIN courses c ON c.id = e.course_id\nGROUP BY c.id, c.name;", "sql"),
                 tip("In SQLite, there is no RIGHT JOIN. Use LEFT JOIN with the tables swapped: 'FROM B LEFT JOIN A' instead of 'FROM A RIGHT JOIN B'."),
             )},
            {"number": 3, "title": "SELF JOIN and CROSS JOIN", "minutes": 20,
             "content": blocks(
                 heading("Advanced Join Types"),
                 code("-- SELF JOIN: join a table to itself\n-- Find students in the same department\nSELECT\n    a.name AS student1,\n    b.name AS student2,\n    a.dept\nFROM students a\nINNER JOIN students b\n    ON a.dept = b.dept AND a.id < b.id\nORDER BY a.dept, a.name;\n\n-- Employee-manager hierarchy (SELF JOIN)\n-- employees(id, name, manager_id) where manager_id is FK to id\nSELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;\n\n-- CROSS JOIN: every combination (Cartesian product)\nSELECT colors.name, sizes.name\nFROM colors CROSS JOIN sizes;\n-- Use for: combinations, test data", "sql"),
             )},
            {"number": 4, "title": "JOIN Practice Queries", "minutes": 30,
             "content": blocks(
                 heading("Real-World JOIN Problems"),
                 code("-- Q1: Top 5 students by total courses completed\nSELECT s.name, COUNT(e.course_id) AS total\nFROM students s\nINNER JOIN enrollments e ON s.id = e.student_id\nGROUP BY s.id, s.name\nORDER BY total DESC\nLIMIT 5;\n\n-- Q2: Courses with no enrollments\nSELECT c.name FROM courses c\nLEFT JOIN enrollments e ON c.id = e.course_id\nWHERE e.course_id IS NULL;\n\n-- Q3: Students who got A grade in more than 2 courses\nSELECT s.name, COUNT(*) AS a_grades\nFROM students s\nINNER JOIN enrollments e ON s.id = e.student_id\nWHERE e.grade >= 9.0\nGROUP BY s.id, s.name\nHAVING COUNT(*) > 2;\n\n-- Q4: Department with highest average enrollment\nSELECT d.name, AVG(enrollments_per_student) AS avg_enroll\nFROM departments d\nINNER JOIN (\n    SELECT s.dept_id, COUNT(e.course_id) AS enrollments_per_student\n    FROM students s LEFT JOIN enrollments e ON s.id=e.student_id\n    GROUP BY s.id\n) sub ON d.id = sub.dept_id\nGROUP BY d.id, d.name\nORDER BY avg_enroll DESC;", "sql"),
             )},
            {"number": 5, "title": "FULL OUTER JOIN and UNION", "minutes": 20,
             "content": blocks(
                 heading("Combining Result Sets"),
                 code("-- UNION: combine results of two queries\n-- (removes duplicates — like DISTINCT)\nSELECT name FROM cs_students\nUNION\nSELECT name FROM it_students;\n\n-- UNION ALL: keeps duplicates (faster)\nSELECT 'CS' AS dept, name FROM cs_students\nUNION ALL\nSELECT 'IT', name FROM it_students;\n\n-- FULL OUTER JOIN simulation in SQLite\n-- (not directly supported in SQLite)\nSELECT s.name, c.name\nFROM students s LEFT JOIN courses c ON s.dept = c.dept\nUNION\nSELECT s.name, c.name\nFROM students s RIGHT JOIN courses c ON s.dept = c.dept;", "sql"),
             )},
        ],
        "quiz": [
            {"question": "What does INNER JOIN return?", "options": ["All rows from the left table", "All rows from the right table", "Only matching rows from both tables", "All rows from both tables"], "correct": 2, "explanation": "INNER JOIN returns only rows where the join condition matches in BOTH tables."},
            {"question": "When would you use LEFT JOIN instead of INNER JOIN?", "options": ["When you want only matching rows", "When you want all rows from the left table even without matches", "When the tables are identical", "When you need faster performance"], "correct": 1, "explanation": "LEFT JOIN returns all rows from the left table, with NULLs for non-matching right table columns."},
            {"question": "What is a SELF JOIN?", "options": ["Joining a table to itself", "Joining without a condition", "A type of LEFT JOIN", "Joining by primary key only"], "correct": 0, "explanation": "SELF JOIN joins a table with itself using aliases — useful for hierarchical data like employees and managers."},
            {"question": "What is the difference between UNION and UNION ALL?", "options": ["UNION is faster", "UNION ALL removes duplicates", "UNION removes duplicates, UNION ALL keeps them", "They are identical"], "correct": 2, "explanation": "UNION removes duplicate rows from the combined result. UNION ALL keeps all rows including duplicates (and is faster)."},
            {"question": "In a LEFT JOIN, what value does the right table column have when there's no match?", "options": ["0", "Empty string", "NULL", "The left table's value"], "correct": 2, "explanation": "When no matching row exists in the right table, all its columns return NULL."},
        ]
    },
    {
        "number": 5, "title": "Data Modification and Transactions", "description": "UPDATE, DELETE, indexes, views, and transactions.", "hours": 3,
        "lessons": [
            {"number": 1, "title": "UPDATE and DELETE", "minutes": 20,
             "content": blocks(
                 heading("Modifying and Removing Data"),
                 code("-- UPDATE rows\nUPDATE students SET gpa = 3.9 WHERE id = 1;\n\n-- Update multiple columns\nUPDATE students\nSET gpa = 4.0, status = 'honor_roll'\nWHERE gpa > 3.8;\n\n-- Update with calculation\nUPDATE products\nSET price = price * 1.10  -- 10% price increase\nWHERE category = 'electronics';\n\n-- DELETE rows\nDELETE FROM students WHERE id = 5;\n\n-- Delete with condition\nDELETE FROM logs WHERE created_at < '2023-01-01';\n\n-- WARNING: DELETE without WHERE deletes ALL rows!\nDELETE FROM students;  -- DANGEROUS — deletes everything!\n-- Use: DELETE FROM students WHERE 1=0 to test first", "sql"),
                 warn("ALWAYS include WHERE in UPDATE and DELETE. Without it, you modify/delete every row. Test your WHERE clause with a SELECT first!"),
             )},
            {"number": 2, "title": "Transactions", "minutes": 20,
             "content": blocks(
                 heading("ACID Transactions — All or Nothing"),
                 code("-- Transactions ensure multiple operations succeed together\n-- ACID: Atomic, Consistent, Isolated, Durable\n\n-- Transfer ₹5000 from Account A to Account B\nBEGIN TRANSACTION;\n\nUPDATE accounts SET balance = balance - 5000\nWHERE account_id = 'ACC001';\n\nUPDATE accounts SET balance = balance + 5000\nWHERE account_id = 'ACC002';\n\n-- If both updates succeed:\nCOMMIT;\n\n-- If anything fails, undo EVERYTHING:\n-- ROLLBACK;\n\n-- SAVEPOINT — partial rollback\nBEGIN TRANSACTION;\nINSERT INTO orders VALUES (1001, 'Alice', 500);\nSAVEPOINT after_order;\nINSERT INTO order_items VALUES (1001, 'Product A', 500);\n-- Oops, wrong product:\nROLLBACK TO after_order;\nINSERT INTO order_items VALUES (1001, 'Product B', 500);\nCOMMIT;", "sql"),
                 tip("Transactions are critical for banking, e-commerce, and any system where partial failures would leave data in an inconsistent state."),
             )},
            {"number": 3, "title": "Indexes", "minutes": 20,
             "content": blocks(
                 heading("Speeding Up Queries with Indexes"),
                 text("An index is a data structure that speeds up SELECT queries on columns you search/sort frequently. Think of it like the index at the back of a textbook — instead of reading every page, you jump directly to the topic."),
                 code("-- Create an index on email (for fast WHERE email = ?)\nCREATE INDEX idx_students_email ON students(email);\n\n-- Composite index (for queries filtering both columns)\nCREATE INDEX idx_orders_customer_date\n    ON orders(customer_id, created_at);\n\n-- UNIQUE index (also enforces uniqueness constraint)\nCREATE UNIQUE INDEX idx_unique_email ON students(email);\n\n-- View indexes\nPRAGMA index_list('students');  -- SQLite\nSHOW INDEXES FROM students;    -- MySQL\n\n-- Drop an index\nDROP INDEX IF EXISTS idx_students_email;\n\n-- EXPLAIN QUERY PLAN — see how SQLite uses indexes\nEXPLAIN QUERY PLAN\nSELECT * FROM students WHERE email = 'alice@uni.edu';", "sql"),
                 warn("Don't add indexes to every column! Indexes speed up reads but slow down writes (INSERT/UPDATE/DELETE) and use extra storage. Index columns used in WHERE, JOIN ON, and ORDER BY."),
             )},
            {"number": 4, "title": "Views", "minutes": 15,
             "content": blocks(
                 heading("Views — Saved Queries"),
                 code("-- A VIEW is a saved SELECT query\n-- Appears as a virtual table\n\nCREATE VIEW top_students AS\nSELECT s.name, s.dept, s.gpa, d.head_name\nFROM students s\nJOIN departments d ON s.dept_id = d.id\nWHERE s.gpa >= 3.7\nORDER BY s.gpa DESC;\n\n-- Use like a table\nSELECT * FROM top_students WHERE dept = 'CS';\n\n-- Complex view: summary statistics\nCREATE VIEW department_stats AS\nSELECT\n    dept,\n    COUNT(*) AS total_students,\n    AVG(gpa) AS avg_gpa,\n    MAX(gpa) AS top_gpa\nFROM students\nGROUP BY dept;\n\nSELECT * FROM department_stats;\n\n-- Drop view\nDROP VIEW IF EXISTS top_students;", "sql"),
             )},
            {"number": 5, "title": "SQL Projects", "minutes": 45,
             "content": blocks(
                 heading("SQL Project: Complete Student Database"),
                 code("-- Full database setup script\nPRAGMA foreign_keys = ON;\n\nCREATE TABLE IF NOT EXISTS departments (\n    id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL\n);\nCREATE TABLE IF NOT EXISTS students (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    name TEXT NOT NULL, email TEXT UNIQUE,\n    dept_id INTEGER REFERENCES departments(id),\n    gpa REAL DEFAULT 0.0, year INTEGER\n);\nCREATE TABLE IF NOT EXISTS courses (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    code TEXT UNIQUE, name TEXT, dept_id INTEGER\n);\nCREATE TABLE IF NOT EXISTS enrollments (\n    student_id INTEGER REFERENCES students(id),\n    course_id INTEGER REFERENCES courses(id),\n    grade REAL, semester TEXT,\n    PRIMARY KEY (student_id, course_id, semester)\n);\n\n-- Insert test data and run analytical queries\nINSERT INTO departments VALUES (1,'CS'),(2,'IT'),(3,'ECE');\nINSERT INTO students (name,email,dept_id,gpa,year) VALUES\n    ('Alice','a@u.edu',1,3.9,2),('Bob','b@u.edu',2,3.2,3),\n    ('Charlie','c@u.edu',1,3.7,1);\n\n-- Report: top student per department\nSELECT d.name, s.name, s.gpa\nFROM departments d\nJOIN students s ON s.dept_id = d.id\nWHERE s.gpa = (\n    SELECT MAX(gpa) FROM students s2 WHERE s2.dept_id = d.id\n)\nORDER BY s.gpa DESC;", "sql"),
                 tip("Store this as a .sql file and practice running it in DB Browser for SQLite (free tool). Understanding this schema is all you need for most junior developer SQL interviews!"),
             )},
        ],
        "quiz": [
            {"question": "What happens if you run DELETE FROM students without WHERE?", "options": ["Deletes only the first row", "Deletes duplicate rows", "Deletes ALL rows", "Does nothing"], "correct": 2, "explanation": "Without a WHERE clause, DELETE removes every row in the table. Always test with SELECT first!"},
            {"question": "What does ROLLBACK do?", "options": ["Saves changes permanently", "Undoes all changes since BEGIN TRANSACTION", "Deletes all data", "Restarts the server"], "correct": 1, "explanation": "ROLLBACK cancels all changes made since the transaction began, restoring the database to its previous state."},
            {"question": "When should you create an index?", "options": ["On every column", "On columns frequently used in WHERE, JOIN, and ORDER BY", "Never — they slow things down", "Only on primary keys"], "correct": 1, "explanation": "Create indexes on columns you search/sort frequently. Avoid indexing every column as it slows down writes."},
            {"question": "What is a database VIEW?", "options": ["A physical copy of a table", "A saved SELECT query that acts like a virtual table", "A backup of the database", "A table with no data"], "correct": 1, "explanation": "A VIEW is a stored query. When you query a view, the underlying SELECT runs and returns results."},
            {"question": "What does COMMIT do?", "options": ["Starts a new transaction", "Deletes a transaction", "Permanently saves all transaction changes", "Rolls back changes"], "correct": 2, "explanation": "COMMIT permanently writes all changes made in the current transaction to the database."},
        ]
    },
    {
        "number": 6, "title": "SQL Projects", "description": "Build real-world databases and write complex analytical queries.", "hours": 5,
        "lessons": [
            {"number": 1, "title": "Project: Student Database System", "minutes": 45,
             "content": blocks(
                 heading("Project 1: Complete Student Database"),
                 code("-- Schema design\nCREATE TABLE students (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    roll TEXT UNIQUE NOT NULL,\n    name TEXT NOT NULL,\n    email TEXT UNIQUE,\n    phone TEXT,\n    dept TEXT,\n    year INTEGER,\n    gpa REAL DEFAULT 0.0,\n    fees_paid REAL DEFAULT 0.0,\n    fees_total REAL DEFAULT 0.0\n);\n\nCREATE TABLE fee_transactions (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    student_id INTEGER REFERENCES students(id),\n    amount REAL,\n    payment_date DATE,\n    method TEXT,  -- cash, online, cheque\n    receipt_no TEXT UNIQUE\n);\n\n-- Analytical queries\n-- 1. Fee defaulters\nSELECT roll, name, (fees_total - fees_paid) AS outstanding\nFROM students WHERE fees_paid < fees_total ORDER BY outstanding DESC;\n\n-- 2. Department-wise GPA stats\nSELECT dept, COUNT(*) students, ROUND(AVG(gpa),2) avg_gpa\nFROM students GROUP BY dept ORDER BY avg_gpa DESC;\n\n-- 3. Monthly fee collection\nSELECT strftime('%Y-%m', payment_date) AS month,\n       SUM(amount) AS collected, COUNT(*) AS transactions\nFROM fee_transactions GROUP BY month ORDER BY month;", "sql"),
             )},
            {"number": 2, "title": "Project: Employee Management", "minutes": 45,
             "content": blocks(
                 heading("Project 2: Employee Management System"),
                 code("CREATE TABLE employees (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    emp_code TEXT UNIQUE, name TEXT NOT NULL,\n    department TEXT, designation TEXT,\n    salary REAL, manager_id INTEGER REFERENCES employees(id),\n    hire_date DATE, is_active INTEGER DEFAULT 1\n);\n\nCREATE TABLE attendance (\n    emp_id INTEGER REFERENCES employees(id),\n    date DATE, status TEXT,  -- present, absent, half_day, wfh\n    PRIMARY KEY (emp_id, date)\n);\n\n-- Queries\n-- 1. Org chart (manager-employee hierarchy)\nSELECT e.name AS employee, m.name AS reports_to, e.designation\nFROM employees e LEFT JOIN employees m ON e.manager_id = m.id\nORDER BY m.name, e.name;\n\n-- 2. Salary by department\nSELECT department, COUNT(*) headcount,\n       SUM(salary) total_payroll, AVG(salary) avg_salary\nFROM employees WHERE is_active = 1\nGROUP BY department ORDER BY total_payroll DESC;\n\n-- 3. Attendance this month\nSELECT e.name,\n       SUM(CASE WHEN a.status='present' THEN 1 ELSE 0 END) present_days,\n       SUM(CASE WHEN a.status='absent' THEN 1 ELSE 0 END) absent_days\nFROM employees e\nJOIN attendance a ON e.id = a.emp_id\nWHERE a.date LIKE '2024-01%'\nGROUP BY e.id, e.name;", "sql"),
             )},
            {"number": 3, "title": "Project: E-commerce Database", "minutes": 45,
             "content": blocks(
                 heading("Project 3: E-commerce Database"),
                 code("CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, city TEXT);\nCREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL, stock INTEGER);\nCREATE TABLE orders (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    customer_id INTEGER REFERENCES customers(id),\n    order_date DATE, status TEXT, total REAL\n);\nCREATE TABLE order_items (\n    order_id INTEGER REFERENCES orders(id),\n    product_id INTEGER REFERENCES products(id),\n    quantity INTEGER, unit_price REAL,\n    PRIMARY KEY(order_id, product_id)\n);\n\n-- E-commerce analytics\n-- 1. Top 10 products by revenue\nSELECT p.name, SUM(oi.quantity * oi.unit_price) revenue\nFROM products p JOIN order_items oi ON p.id = oi.product_id\nJOIN orders o ON o.id = oi.order_id WHERE o.status = 'delivered'\nGROUP BY p.id ORDER BY revenue DESC LIMIT 10;\n\n-- 2. Customer lifetime value\nSELECT c.name, COUNT(o.id) orders, SUM(o.total) total_spent\nFROM customers c LEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id ORDER BY total_spent DESC;", "sql"),
             )},
            {"number": 4, "title": "SQL Final Assessment", "minutes": 45,
             "content": blocks(
                 heading("SQL Fundamentals — Final Assessment"),
                 text("This assessment tests your complete SQL knowledge. The questions cover: SELECT, WHERE, GROUP BY, HAVING, JOINs, subqueries, window functions, transactions, and indexes."),
                 lst("Part 1: Write queries for the given scenarios (open-ended)",
                     "Part 2: Multiple choice questions on SQL concepts",
                     "Part 3: Debug and fix broken SQL queries",
                     "Part 4: Design a normalized database schema"),
                 practice("Write a query to find the top 3 students by GPA in each department.", "SELECT dept, name, gpa FROM (\n  SELECT dept, name, gpa, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY gpa DESC) rn FROM students\n) WHERE rn <= 3;"),
                 tip("After SQL, learn: 1) PostgreSQL (industry standard) 2) ORM frameworks (SQLAlchemy, Hibernate) 3) Database design patterns 4) Query optimization"),
             )},
            {"number": 5, "title": "SQL in the Real World", "minutes": 20,
             "content": blocks(
                 heading("SQL Career Applications"),
                 text("SQL is one of the most valuable and durable skills in tech. Every company — from startups to enterprises — uses relational databases. Here's how SQL is used across different roles:"),
                 lst("Data Analyst: Write complex queries, create dashboards, export reports from databases like PostgreSQL or BigQuery",
                     "Backend Developer: Write efficient queries for APIs, design schemas, use ORMs (SQLAlchemy, Hibernate)",
                     "Data Engineer: Build ETL pipelines, transform data with SQL on tools like dbt, Apache Spark SQL",
                     "ML Engineer: Extract training data from databases, write feature engineering SQL",
                     "Business Analyst: Analyze user behavior, sales trends, and KPIs using BI tools backed by SQL"),
                 example("Interview reality: Most Data Analyst and Backend Developer interviews include 2-3 SQL coding rounds. Practice writing JOIN + GROUP BY + HAVING queries on LeetCode SQL or HackerRank."),
                 tip("Must-know databases for your career: PostgreSQL (open-source, powerful), MySQL (web applications), SQLite (embedded), BigQuery (cloud analytics). Start with SQLite, then move to PostgreSQL."),
             )},
        ],
        "quiz": [
            {"question": "Which SQL clause is equivalent to Python's if-else?", "options": ["WHERE", "HAVING", "CASE WHEN", "FILTER"], "correct": 2, "explanation": "CASE WHEN provides conditional logic in SQL queries, similar to if-elif-else in Python."},
            {"question": "What is database normalization?", "options": ["Making all values uppercase", "Splitting data into multiple tables to reduce redundancy", "Adding indexes to all columns", "Encrypting the database"], "correct": 1, "explanation": "Normalization organizes data into related tables to minimize duplication and improve data integrity."},
            {"question": "What does a Foreign Key enforce?", "options": ["Unique values", "Referential integrity between tables", "Not null values", "Default values"], "correct": 1, "explanation": "A foreign key ensures that a value in one table references a valid value in another table (referential integrity)."},
            {"question": "Which is faster for lookup queries on large tables?", "options": ["Full table scan", "Indexed column search", "Subquery", "UNION"], "correct": 1, "explanation": "An index on the searched column allows the database to find rows in O(log n) time vs O(n) for a full scan."},
            {"question": "In which role is SQL most critically used?", "options": ["Frontend Developer", "UI/UX Designer", "Data Analyst", "DevOps Engineer"], "correct": 2, "explanation": "Data Analysts use SQL daily to query databases, analyze trends, and build reports. It's arguably their most important tool."},
        ]
    },
]

# ─── Minimal course data (Analytics + Web Dev) ───────────────────────────────

ANALYTICS_MODULES = [
    {"number": i+1, "title": title, "description": desc, "hours": 4,
     "lessons": [
         {"number": j+1, "title": lt, "minutes": 25,
          "content": blocks(heading(lt), text(f"This lesson covers {lt} in the context of Data Analytics. You will learn theoretical concepts, practical techniques, real-world applications, and common interview questions about {lt}."), code(f"# Python code example for {lt}\nimport pandas as pd\n\ndf = pd.DataFrame({{'name': ['Alice', 'Bob', 'Charlie'], 'score': [85, 72, 93]}})\nprint(df.describe())", "python"), tip(f"In data analytics interviews, you will often be asked to explain {lt} with a real-world example. Prepare 2-3 concrete examples."), warn(f"Common mistake with {lt}: not handling missing values (NaN) before performing calculations."), practice(f"Apply {lt} to a sample dataset and explain your findings.", f"Use pandas to analyze data: df.groupby('category').agg({{'value': ['mean', 'std', 'count']}})"),)}
         for j, lt in enumerate(lessons)
     ], "quiz": [{"question": f"What is the primary purpose of {title}?", "options": ["To make dashboards", "To derive insights from data", "To create databases", "To write code"], "correct": 1, "explanation": f"{title} is used to analyze and extract meaningful insights from data."}] * 1}
    for i, (title, desc, lessons) in enumerate([
        ("Statistics for Analytics", "Learn descriptive statistics and probability for data analysis.",
         ["Mean, Median and Mode", "Standard Deviation and Variance", "Normal Distribution", "Correlation vs Causation", "Sampling Techniques"]),
        ("Excel for Data Analysis", "Master Excel formulas, pivot tables, and data visualization.",
         ["Excel Formulas: SUM, AVERAGE, IF", "VLOOKUP and INDEX-MATCH", "Pivot Tables", "Charts and Visualization", "Data Cleaning in Excel"]),
        ("Python Pandas", "Analyze data with the powerful Pandas library.",
         ["DataFrames and Series Basics", "Filtering and Selecting Data", "GroupBy and Aggregation", "Handling Missing Data", "Merging DataFrames"]),
        ("Data Visualization", "Create compelling charts and dashboards.",
         ["Matplotlib Basics", "Seaborn Statistical Plots", "Choosing the Right Chart", "Good Visualization Principles", "Building a Portfolio Dashboard"]),
        ("Projects and Career", "Apply analytics skills to real-world projects.",
         ["Project: Sales Analysis", "Project: Student Performance Dashboard", "Building a Portfolio", "SQL + Python Integration", "Final Assessment"]),
    ])
]

WEBDEV_MODULES = [
    {"number": i+1, "title": title, "description": desc, "hours": 5,
     "lessons": [
         {"number": j+1, "title": lt, "minutes": 30,
          "content": blocks(heading(lt), text(f"In this lesson, you'll master {lt} — a key concept in web development. This builds on everything covered so far and prepares you for building real websites and web apps."), code(f"// JavaScript/HTML/CSS code example for: {lt}\n// Example demonstrating core concepts\nconsole.log('Implementing: {lt}');", "javascript"), tip(f"Pro tip for {lt}: Always test across Chrome, Firefox, and Safari to ensure cross-browser compatibility."), warn(f"Common mistake with {lt}: Not considering mobile users. Always design mobile-first!"), lst(f"Key concept 1 in {lt}", f"Key concept 2 in {lt}", "Best practices", "Interview questions"),)}
         for j, lt in enumerate(lessons)
     ], "quiz": [{"question": f"What technology is {title} associated with?", "options": ["Python", "HTML/CSS/JavaScript", "SQL", "Java"], "correct": 1, "explanation": f"{title} is a core topic in web development using HTML, CSS, and JavaScript."}] * 1}
    for i, (title, desc, lessons) in enumerate([
        ("HTML Fundamentals", "Structure web pages with HTML5.", ["HTML Structure and Tags", "Headings, Paragraphs, Links", "Lists, Tables, Forms", "Semantic HTML", "HTML5 Best Practices"]),
        ("CSS Fundamentals", "Style web pages with CSS3.", ["CSS Selectors and Specificity", "Box Model", "Colors and Typography", "Display and Positioning", "Responsive Design"]),
        ("CSS Layouts", "Build modern layouts with Flexbox and Grid.", ["Flexbox Complete Guide", "CSS Grid Complete Guide", "Positioning Techniques", "CSS Variables", "Animations and Transitions"]),
        ("JavaScript Fundamentals", "Add interactivity with JavaScript.", ["Variables and Data Types", "Functions and Scope", "Arrays and Objects", "DOM Manipulation", "Async JavaScript"]),
        ("JavaScript Advanced", "Master ES6+ and advanced patterns.", ["ES6+ Features", "Array Methods: map/filter/reduce", "OOP with Classes", "Error Handling", "Browser APIs"]),
        ("React Basics", "Build UIs with React.", ["Introduction to React and JSX", "Components and Props", "State with useState", "Events and Forms", "useEffect Hook"]),
        ("Building React Apps", "Build complete React applications.", ["React Router", "State Management", "Fetching API Data", "Building a Todo App", "Deployment"]),
        ("Web Dev Projects", "Build your portfolio with real projects.", ["Project: Portfolio Website", "Project: Weather App", "Project: React Task Manager", "Project: Full Mini App", "Final Assessment"]),
    ])
]


# ─── Full course definitions ──────────────────────────────────────────────────

ALL_COURSES = [
    {
        "slug": "python-programming", "title": "Python Programming",
        "description": "Master Python from scratch — variables, control flow, data structures, functions, OOP, file handling, and practical projects.",
        "difficulty": "beginner", "duration_weeks": 6, "category": "programming",
        "skills_gained": ["Python Syntax", "Data Structures", "Functions & OOP", "File I/O", "Problem Solving"],
        "prerequisites_text": "No prior programming experience needed. Basic computer skills required.",
        "modules": PYTHON_MODULES,
        "project": {
            "title": "Python Expense Tracker",
            "description": "Build a complete expense tracking application with file persistence, analytics, and OOP design.",
            "objective": "Apply Python fundamentals: OOP, file handling, data structures, and user interaction to build a real-world tool.",
            "requirements": ["Python 3.x", "json module (built-in)", "os module (built-in)", "datetime module (built-in)"],
            "steps": [
                {"title": "Design the data model", "content": "Create an Expense class with attributes: date, category, amount, description. Use @dataclass for clean code."},
                {"title": "Implement file persistence", "content": "Write save_to_json() and load_from_json() functions using the json module to persist data between sessions."},
                {"title": "Build the ExpenseTracker class", "content": "Create the main class with methods: add_expense(), delete_expense(), total_by_category(), monthly_report()."},
                {"title": "Add CLI interface", "content": "Build a menu-driven command-line interface with options: 1=Add, 2=View, 3=Report, 4=Exit. Use input() and loops."},
                {"title": "Add analytics", "content": "Implement monthly summaries, category breakdowns, and budget tracking. Use sorted() and dict comprehensions."},
                {"title": "Test edge cases", "content": "Test with empty data, invalid inputs, negative amounts. Add proper error handling with try-except."},
                {"title": "Extend (optional)", "content": "Add matplotlib visualization for spending charts, CSV export, or a simple web UI with Flask."},
            ],
            "expected_output": "A working command-line app that saves expenses to JSON, shows category totals, generates monthly reports.",
            "difficulty": "intermediate"
        }
    },
    {
        "slug": "sql-fundamentals", "title": "SQL & Database Fundamentals",
        "description": "Learn SQL from scratch — database design, queries, joins, aggregations, transactions, and real-world projects.",
        "difficulty": "beginner", "duration_weeks": 4, "category": "data",
        "skills_gained": ["SQL Queries", "Database Design", "Joins & Aggregations", "Indexing", "Transactions"],
        "prerequisites_text": "Basic computer skills. No prior database experience needed.",
        "modules": SQL_MODULES,
        "project": {
            "title": "Student Database System",
            "description": "Design and build a complete relational database for managing student information.",
            "objective": "Apply SQL concepts: table design, relationships, queries, joins, and transactions to a real-world use case.",
            "requirements": ["SQLite (built into Python)", "DB Browser for SQLite (optional GUI)"],
            "steps": [
                {"title": "Design the schema", "content": "Design tables: students, departments, courses, enrollments, fee_transactions with proper PKs and FKs."},
                {"title": "Create tables", "content": "Write CREATE TABLE statements with appropriate data types, constraints (NOT NULL, UNIQUE), and FOREIGN KEYs."},
                {"title": "Insert sample data", "content": "Write INSERT statements to populate 20+ students, 5 departments, 10+ courses, and enrollment records."},
                {"title": "Write analytical queries", "content": "Write SELECT queries for: top students by GPA, department statistics, course enrollment counts."},
                {"title": "Add JOIN queries", "content": "Write multi-table queries: student with department name, enrollment with course details, fee summaries."},
                {"title": "Create useful views", "content": "CREATE VIEW statements for: student_report, department_stats, fee_defaulters, honor_roll."},
                {"title": "Test with Python", "content": "Use Python's sqlite3 module to connect to the database, run queries, and display formatted results."},
            ],
            "expected_output": "A fully functional SQLite database with complete schema, sample data, 10+ queries, and Python integration.",
            "difficulty": "beginner"
        }
    },
    {
        "slug": "data-analytics", "title": "Data Analytics Fundamentals",
        "description": "Learn the complete data analytics workflow — statistics, Excel, data visualization, and Python for data analysis.",
        "difficulty": "beginner", "duration_weeks": 5, "category": "data",
        "skills_gained": ["Statistics", "Excel/Spreadsheets", "Data Visualization", "Python Pandas", "Business Insights"],
        "prerequisites_text": "Basic math. Familiarity with spreadsheets helpful but not required.",
        "modules": ANALYTICS_MODULES,
        "project": {
            "title": "Sales Analytics Dashboard",
            "description": "Analyze e-commerce sales data using Python Pandas and create visualizations.",
            "objective": "Apply the complete analytics workflow: data loading, cleaning, analysis, and visualization to real business data.",
            "requirements": ["Python 3.x", "pandas (pip install pandas)", "matplotlib (pip install matplotlib)", "seaborn (pip install seaborn)"],
            "steps": [
                {"title": "Load and explore data", "content": "Load CSV sales data with pd.read_csv(). Use .head(), .info(), .describe() to understand the dataset."},
                {"title": "Clean the data", "content": "Handle missing values with .fillna() and .dropna(). Fix data types. Remove duplicates with .drop_duplicates()."},
                {"title": "Analyze sales trends", "content": "Group by month with df.groupby('month')['sales'].sum(). Calculate month-over-month growth."},
                {"title": "Product analysis", "content": "Find top-selling products by revenue and units. Calculate profit margins."},
                {"title": "Customer segmentation", "content": "Segment customers by total spend: high-value (>10000), medium (5000-10000), low (<5000)."},
                {"title": "Create visualizations", "content": "Build: bar chart for top products, line chart for monthly trends, pie chart for category split."},
                {"title": "Write insights report", "content": "Document 5 key business insights from your analysis with supporting charts."},
            ],
            "expected_output": "A Python script that loads sales data, generates analytics, and creates 5 publication-quality charts.",
            "difficulty": "beginner"
        }
    },
    {
        "slug": "web-development", "title": "Web Development Fundamentals",
        "description": "Build modern websites and web apps from scratch — HTML, CSS, JavaScript, and React fundamentals.",
        "difficulty": "beginner", "duration_weeks": 8, "category": "programming",
        "skills_gained": ["HTML5", "CSS3 & Flexbox/Grid", "JavaScript ES6+", "React Basics", "Responsive Design"],
        "prerequisites_text": "No prior experience needed. Familiarity with computers required.",
        "modules": WEBDEV_MODULES,
        "project": {
            "title": "Personal Portfolio Website",
            "description": "Build a complete responsive personal portfolio website to showcase your projects.",
            "objective": "Apply HTML, CSS, and JavaScript to create a professional portfolio suitable for job applications.",
            "requirements": ["Text editor (VS Code)", "Web browser", "GitHub account for deployment"],
            "steps": [
                {"title": "Plan the structure", "content": "Sketch your portfolio sections: Hero/About, Skills, Projects, Contact. Write the HTML skeleton."},
                {"title": "Build the HTML", "content": "Create semantic HTML with header, nav, main, sections, footer. Add your real content (name, bio, skills)."},
                {"title": "Style with CSS", "content": "Apply typography, colors, spacing. Build responsive layout with Flexbox/Grid. Add a mobile menu."},
                {"title": "Add animations", "content": "CSS transitions for hover effects. JavaScript Intersection Observer for scroll animations."},
                {"title": "Build the projects section", "content": "Create project cards with image, title, description, tech stack badges, and GitHub/live demo links."},
                {"title": "Add contact form", "content": "Build a contact form. Integrate Formspree or EmailJS for actual email sending (no backend needed)."},
                {"title": "Deploy to GitHub Pages", "content": "Push to GitHub, enable Pages in settings. Your portfolio is live at username.github.io/portfolio!"},
            ],
            "expected_output": "A live, responsive portfolio website deployed at a public URL with your real projects and contact information.",
            "difficulty": "beginner"
        }
    },
]


def seed():
    session = SessionLocal()
    try:
        for c_data in ALL_COURSES:
            # Idempotency check
            existing = session.execute(select(Course).where(Course.slug == c_data['slug'])).scalars().first()
            if existing:
                print(f"  Skipping '{c_data['slug']}' — already exists.")
                continue

            print(f"\n  Seeding course: {c_data['title']} ...")

            total_lessons = sum(len(m['lessons']) for m in c_data['modules'])
            course = Course(
                id=uuid.uuid4(),
                slug=c_data['slug'],
                title=c_data['title'],
                description=c_data['description'],
                difficulty=c_data['difficulty'],
                duration_weeks=c_data['duration_weeks'],
                num_modules=len(c_data['modules']),
                num_lessons=total_lessons,
                category=c_data['category'],
                skills_gained_json=json.dumps(c_data['skills_gained']),
                prerequisites_text=c_data['prerequisites_text'],
                is_published=True,
                created_at=datetime.now(timezone.utc),
            )
            session.add(course)
            session.flush()

            for mod_data in c_data['modules']:
                module = CourseModule(
                    id=uuid.uuid4(),
                    course_id=course.id,
                    module_number=mod_data['number'],
                    title=mod_data['title'],
                    description=mod_data['description'],
                    estimated_hours=mod_data['hours'],
                    created_at=datetime.now(timezone.utc),
                )
                session.add(module)
                session.flush()

                for lesson_data in mod_data['lessons']:
                    lesson = Lesson(
                        id=uuid.uuid4(),
                        module_id=module.id,
                        course_id=course.id,
                        lesson_number=lesson_data['number'],
                        title=lesson_data['title'],
                        content_blocks_json=lesson_data['content'],
                        estimated_minutes=lesson_data['minutes'],
                        created_at=datetime.now(timezone.utc),
                    )
                    session.add(lesson)
                    print(f"    + Lesson {lesson_data['number']}: {lesson_data['title']}")

                # Quiz questions (5 per module)
                quizzes = mod_data.get('quiz', [])
                for i, q in enumerate(quizzes):
                    quiz = QuizQuestion(
                        id=uuid.uuid4(),
                        module_id=module.id,
                        question=q['question'],
                        question_type='mcq',
                        options_json=json.dumps(q['options']),
                        correct_answer=str(q['correct']),
                        explanation=q['explanation'],
                        points=1,
                        created_at=datetime.now(timezone.utc),
                    )
                    session.add(quiz)

            # Course project
            proj_data = c_data.get('project', {})
            if proj_data:
                project = Project(
                    id=uuid.uuid4(),
                    course_id=course.id,
                    title=proj_data['title'],
                    description=proj_data['description'],
                    objective=proj_data['objective'],
                    requirements_json=json.dumps(proj_data['requirements']),
                    steps_json=json.dumps(proj_data['steps']),
                    expected_output=proj_data['expected_output'],
                    difficulty=proj_data['difficulty'],
                    created_at=datetime.now(timezone.utc),
                )
                session.add(project)

            session.flush()
            print(f"  ✓ {c_data['title']} — {len(c_data['modules'])} modules, {total_lessons} lessons")

        session.commit()
        print("\n✅ All courses seeded successfully!")
    except Exception as e:
        session.rollback()
        print(f"\n❌ Error: {e}")
        import traceback; traceback.print_exc()
    finally:
        session.close()


if __name__ == '__main__':
    print("🌱 Seeding course database...")
    seed()
