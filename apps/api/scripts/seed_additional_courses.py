"""
seed_additional_courses.py
Seeds 8 new career-oriented courses into SQLite without duplicating the existing 4 courses.
"""

import os
import sys
import json
import uuid
import sqlite3
from datetime import datetime, timezone

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'dev.db'))

def blocks(*items):
    return json.dumps(list(items))

def heading(text): return {"type": "heading", "content": text}
def text(t): return {"type": "text", "content": t}
def code(content, lang="python", output=None): return {"type": "code", "content": content, "language": lang, "output": output}
def tip(t): return {"type": "tip", "content": t}
def warn(t): return {"type": "warning", "content": t}
def lst(*items): return {"type": "list", "content": list(items)}
def example(t): return {"type": "example", "content": t}
def practice(q, a): return {"type": "practice", "content": f"{q}|||{a}"}

NEW_COURSES = [
    # ─── 1. Data Structures & Algorithms ────────────────────────────────────
    {
        "slug": "data-structures-algorithms",
        "title": "Data Structures & Algorithms",
        "description": "Master algorithmic thinking, computational complexity (Big O), linear and non-linear data structures, and advanced problem-solving techniques for software engineering interviews.",
        "difficulty": "intermediate",
        "duration_weeks": 8,
        "category": "programming",
        "skills_gained": ["Big-O Analysis", "Arrays & Strings", "Linked Lists & Trees", "Graphs & DP", "Systematic Problem Solving"],
        "prerequisites_text": "Proficiency in at least one programming language (Python, Java, or C++) and basic discrete math.",
        "modules": [
            {
                "number": 1,
                "title": "Algorithm Fundamentals & Asymptotic Complexity",
                "description": "Understand time and space complexity, Big-O, Big-Omega, and Big-Theta notations with mathematical proofs.",
                "hours": 5.0,
                "lessons": [
                    {
                        "number": 1,
                        "title": "Introduction to Asymptotic Analysis & Big O",
                        "minutes": 25,
                        "content": blocks(
                            heading("What is Algorithmic Complexity?"),
                            text("Algorithmic complexity measures how the runtime or memory requirement of an algorithm scales as the input size (N) grows towards infinity. Rather than measuring elapsed seconds on a physical computer (which fluctuates with CPU speed and background processes), computer scientists evaluate the asymptotic rate of operation count growth."),
                            lst("O(1) - Constant Time: Operations take uniform time regardless of input size.",
                                "O(log N) - Logarithmic Time: The problem space halves at each iteration (Binary Search).",
                                "O(N) - Linear Time: Operations scale directly in proportion to input elements.",
                                "O(N log N) - Linearithmic Time: Optimal comparison sorting (Merge Sort, Heap Sort).",
                                "O(N²) - Quadratic Time: Nested loops over the input (Bubble Sort, Selection Sort).",
                                "O(2ᴺ) - Exponential Time: Recursive branching doubling at each depth."),
                            code("def find_element(arr, target):\n    # O(1) space, O(N) worst-case time\n    for idx, item in enumerate(arr):\n        if item == target:\n            return idx\n    return -1", "python", "Returns index or -1"),
                            tip("Always analyze both Time Complexity (CPU operations) and Space/Auxiliary Complexity (memory consumed outside the input itself)."),
                            warn("Do not confuse best-case with average or worst-case! In technical interviews, interviewers expect the worst-case and amortized bounds unless specified otherwise."),
                            example("Real-world: Google Search uses sub-linear distributed indexing to return billions of records in fractions of a second rather than scanning web pages linearly."),
                            practice("What is the time complexity of looking up a key in a balanced hash map?", "Average case O(1), worst case O(N) during severe hash collision clustering."),
                        )
                    },
                    {
                        "number": 2,
                        "title": "Space Complexity & Amortized Analysis",
                        "minutes": 25,
                        "content": blocks(
                            heading("Memory Footprint & Auxiliary Space"),
                            text("Auxiliary space refers to the temporary memory allocated by an algorithm during execution, excluding the input space. Dynamic arrays (like Python lists or Java ArrayLists) use geometric resizing to achieve amortized O(1) appends, even though occasional resize operations require O(N) allocations."),
                            code("def duplicate_elements(arr):\n    # Input size: N\n    # Auxiliary space: O(N) because a new list of size N is allocated\n    result = []\n    for x in arr:\n        result.append(x * 2)\n    return result", "python"),
                            tip("In recursion, memory on the call stack counts toward space complexity! A recursive tree of depth D consumes O(D) stack frames."),
                            warn("Creating slices of arrays (e.g., arr[1:]) in Python creates a shallow copy consuming O(N) time and space! Pass pointer indices instead of slicing inside recursive calls."),
                            practice("What is the space complexity of quicksort?", "O(log N) auxiliary stack space for recursion in balanced splits, O(N) worst-case."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "What is the time complexity of searching an item in a sorted array of size N using binary search?",
                        "options": ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
                        "correct": 1,
                        "explanation": "Binary search divides the search space in half at each step, yielding logarithmic O(log N) runtime."
                    }
                ]
            },
            {
                "number": 2,
                "title": "Linear Data Structures: Arrays, Strings & Linked Lists",
                "description": "Master contiguous memory arrays, two-pointer techniques, sliding windows, and pointer manipulation in linked lists.",
                "hours": 6.0,
                "lessons": [
                    {
                        "number": 1,
                        "title": "Two-Pointer and Sliding Window Patterns",
                        "minutes": 30,
                        "content": blocks(
                            heading("The Two-Pointer Technique"),
                            text("The two-pointer technique uses two directional pointer indices iterating over an array or string to reduce O(N²) quadratic nested loops down to optimal O(N) linear time. It is frequently applied to sorted arrays, palindrome verifications, and partition algorithms."),
                            code("def two_sum_sorted(numbers, target):\n    left, right = 0, len(numbers) - 1\n    while left < right:\n        curr_sum = numbers[left] + numbers[right]\n        if curr_sum == target:\n            return [left, right]\n        elif curr_sum < target:\n            left += 1\n        else:\n            right -= 1\n    return []", "python", "two_sum_sorted([2, 7, 11, 15], 9) -> [0, 1]"),
                            tip("When dealing with subarray problems that require finding max/min length under a constraint, think of Sliding Window!"),
                            warn("Be vigilant with boundary off-by-one errors when updating pointer boundaries (left <= right vs left < right)."),
                            practice("When does two-pointer work for finding a pair sum?", "When the input array is sorted, allowing deterministic advancement of either left or right pointer."),
                        )
                    },
                    {
                        "number": 2,
                        "title": "Singly and Doubly Linked Lists",
                        "minutes": 30,
                        "content": blocks(
                            heading("Pointer-Chained Nodes in Memory"),
                            text("Unlike arrays, linked lists allocate individual nodes scattered across heap memory, linked by pointer references. They offer O(1) insertions and deletions at known positions without memory shifting, but sacrifice O(1) random index access."),
                            code("class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev", "python"),
                            tip("Always use a dummy head node (dummy = ListNode(0, head)) when performing insertions or deletions that could affect the head pointer."),
                            warn("Losing reference to the next node before modifying curr.next creates infinite loops or memory leaks. Always store nxt = curr.next first."),
                            practice("What is the time complexity to access the K-th element of a linked list?", "O(K) linear traversal time since nodes must be traversed sequentially from head."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "Which data structure provides O(1) access time by index?",
                        "options": ["Singly Linked List", "Dynamic Array", "Doubly Linked List", "Queue"],
                        "correct": 1,
                        "explanation": "Arrays provide instant O(1) index access using base address + index * element_size offset arithmetic."
                    }
                ]
            },
            {
                "number": 3,
                "title": "Trees, Binary Search Trees & Heaps",
                "description": "Hierarchical structures, tree traversals (DFS/BFS), binary search tree invariants, and priority queues.",
                "hours": 6.5,
                "lessons": [
                    {
                        "number": 1,
                        "title": "Binary Trees and Inorder/Preorder/Postorder Traversals",
                        "minutes": 30,
                        "content": blocks(
                            heading("Hierarchical Tree Traversal"),
                            text("A binary tree is a non-linear data structure where each parent node contains at most two children (left and right). Depth-First Search (DFS) encompasses Inorder (Left, Root, Right), Preorder (Root, Left, Right), and Postorder (Left, Right, Root) traversals."),
                            code("class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef inorder_traversal(root):\n    # For BST, Inorder yields sorted values in ascending order\n    res = []\n    def dfs(node):\n        if not node: return\n        dfs(node.left)\n        res.append(node.val)\n        dfs(node.right)\n    dfs(root)\n    return res", "python"),
                            tip("An Inorder traversal over a valid Binary Search Tree (BST) will ALWAYS produce elements in strictly sorted ascending order!"),
                            warn("Trees that become unbalanced degrade into linked lists with O(N) operations. Self-balancing trees (AVL, Red-Black) preserve O(log N) height."),
                            practice("What traversal is used for evaluating mathematical expression trees?", "Postorder traversal evaluates left and right operands before applying the parent operator."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "What is the maximum number of nodes in a binary tree of height H (1-indexed)?",
                        "options": ["2^H - 1", "2^(H-1)", "H^2", "2*H"],
                        "correct": 0,
                        "explanation": "A complete binary tree of height H has 2^H - 1 nodes across all levels."
                    }
                ]
            }
        ],
        "project": {
            "title": "High-Throughput LRU Cache Engine",
            "description": "Design and build a Least Recently Used (LRU) Cache combining a Hash Map and a Doubly Linked List to achieve O(1) get and put operations.",
            "objective": "Implement an in-memory caching engine that evicts the least recently accessed keys when capacity exceeds maximum bounds.",
            "requirements": ["O(1) get(key) lookup time", "O(1) put(key, value) insertion time", "Doubly Linked List node eviction logic", "Unit test suite with edge cases"],
            "steps": [
                {"step": 1, "title": "Node Class Setup", "content": "Create a Doubly Linked List Node class with key, value, prev, and next pointers."},
                {"step": 2, "title": "Sentinel Head and Tail", "content": "Initialize dummy head and dummy tail sentinels to avoid edge null checks."},
                {"step": 3, "title": "Hash Map Binding", "content": "Map key -> Node reference for instantaneous retrieval."},
                {"step": 4, "title": "Capacity Eviction", "content": "Evict node right before tail sentinel upon exceeding capacity."}
            ],
            "expected_output": "All get and put calls execute in O(1) amortized time with automated LRU eviction.",
            "difficulty": "intermediate"
        }
    },

    # ─── 2. Git & GitHub ────────────────────────────────────────────────────
    {
        "slug": "git-github",
        "title": "Git & GitHub Mastery",
        "description": "Master professional distributed version control, branching workflows, merging, conflict resolution, pull request collaboration, and GitHub portfolio development.",
        "difficulty": "beginner",
        "duration_weeks": 4,
        "category": "tools",
        "skills_gained": ["Git Architecture", "Branching & Merging", "Rebasing & Cherry-Pick", "Pull Requests", "CI/CD & GitHub Actions"],
        "prerequisites_text": "Familiarity with the command line or terminal basics.",
        "modules": [
            {
                "number": 1,
                "title": "Version Control Architecture & Repositories",
                "description": "Understand snapshots, staging area (index), working directory, and commits as immutable cryptographically hashed objects.",
                "hours": 3.0,
                "lessons": [
                    {
                        "number": 1,
                        "title": "How Git Works: The Three Trees Architecture",
                        "minutes": 20,
                        "content": blocks(
                            heading("The Three Trees of Git"),
                            text("Git operates on three primary stages: the Working Directory (actual files on disk), the Staging Area / Index (prepared snapshot of proposed changes), and the Git Directory / Repository (the permanently committed snapshots stored as SHA-1/SHA-256 objects)."),
                            lst("Working Directory: Local files you edit in your code editor.",
                                "Staging Area (git add): Cache of modified files slated for the next commit.",
                                "Repository (git commit): Permanent commit history referenced by the HEAD pointer."),
                            code("# Basic repository initialization and first commit\ngit init my-project\ncd my-project\necho '# Welcome' > README.md\ngit add README.md\ngit commit -m 'feat: initial commit with README'", "bash"),
                            tip("Write clear, conventional commit messages: feat:, fix:, docs:, refactor:, test:, chore:. This makes automated change-logs trivial."),
                            warn("Never commit API keys, secrets, or .env files to Git! Always configure a .gitignore file prior to your initial commit."),
                            practice("What does git status show?", "It shows modified files in the working directory and files staged for commit in the index."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "Which command moves changes from the working directory into the staging area?",
                        "options": ["git commit", "git push", "git add", "git status"],
                        "correct": 2,
                        "explanation": "git add stages modified files so they can be bundled into the next commit snapshot."
                    }
                ]
            },
            {
                "number": 2,
                "title": "Branches, Merging & Conflict Resolution",
                "description": "Manage feature branches, fast-forward vs three-way merges, merge conflicts, and interactive rebasing.",
                "hours": 4.0,
                "lessons": [
                    {
                        "number": 1,
                        "title": "Branching Strategies and Resolving Conflicts",
                        "minutes": 25,
                        "content": blocks(
                            heading("Isolated Workflows via Branches"),
                            text("A Git branch is simply a lightweight, movable pointer to a commit. Creating branches costs virtually zero disk overhead because Git does not duplicate files—it references snapshot trees."),
                            code("# Creating and switching branches\ngit checkout -b feature/auth-flow\n# Make edits...\ngit commit -am 'feat: implement JWT authentication'\n\n# Switch back and merge\ngit checkout main\ngit merge feature/auth-flow", "bash"),
                            heading("Resolving Merge Conflicts"),
                            text("When two branches modify the exact same lines of code, Git cannot automatically decide which version takes precedence. It injects conflict markers (<<<<<<<, =======, >>>>>>>) that developers must manually reconcile."),
                            tip("Run git pull --rebase origin main before opening a pull request to keep history linear and catch merge conflicts locally."),
                            warn("Never force-push (git push -f) to shared public branches like main or develop! This rewrites history for all teammates."),
                            practice("What causes a Git merge conflict?", "When Git encounters contradictory edits on the exact same lines across two diverging branches."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "What is the primary danger of git push --force on a shared branch?",
                        "options": ["It deletes all local files", "It overwrites commits pushed by other teammates", "It changes Git configuration", "It slows down internet connection"],
                        "correct": 1,
                        "explanation": "Force pushing replaces remote commit history with local history, potentially discarding colleagues' pushed work."
                    }
                ]
            }
        ],
        "project": {
            "title": "Open Source Collaboration Simulation",
            "description": "Create a multi-branch repository with Git Hooks, automated GitHub Actions CI, branch protection rules, and merge conflict resolution.",
            "objective": "Build a production-grade developer workflow repository demonstrating professional team habits.",
            "requirements": ["Branch protection on main", "Feature branch pull request workflow", "Pre-commit linting hook", "Successful merge conflict resolution"],
            "steps": [
                {"step": 1, "title": "Repo Setup", "content": "Initialize Git repository and define .gitignore and README."},
                {"step": 2, "title": "Branching", "content": "Create feature branches simulating two developers editing shared config."},
                {"step": 3, "title": "Conflict Handling", "content": "Trigger and successfully resolve a merge conflict."},
                {"step": 4, "title": "GitHub Actions", "content": "Add a .github/workflows/ci.yml workflow for automated linting."}
            ],
            "expected_output": "Clean Git repository with linear commit history and documented pull requests.",
            "difficulty": "beginner"
        }
    },

    # ─── 3. Cloud Computing ─────────────────────────────────────────────────
    {
        "slug": "cloud-computing",
        "title": "Cloud Computing Fundamentals",
        "description": "Explore cloud architectures across AWS, Azure, and Google Cloud. Master compute, object storage, managed databases, VPC networking, security governance, and serverless applications.",
        "difficulty": "beginner",
        "duration_weeks": 6,
        "category": "cloud",
        "skills_gained": ["IaaS/PaaS/SaaS", "AWS Core Services", "Cloud Networking & VPC", "IAM Security", "Serverless Computing"],
        "prerequisites_text": "Basic understanding of networking (IPs, DNS) and web architectures.",
        "modules": [
            {
                "number": 1,
                "title": "Cloud Architecture & Service Models",
                "description": "Understand public vs private cloud, shared responsibility model, IaaS vs PaaS vs SaaS, and multi-region availability zones.",
                "hours": 4.0,
                "lessons": [
                    {
                        "number": 1,
                        "title": "IaaS, PaaS, SaaS and the Shared Responsibility Model",
                        "minutes": 25,
                        "content": blocks(
                            heading("Demystifying Cloud Service Models"),
                            text("Cloud computing delivers computing services—including servers, storage, databases, networking, software, and analytics—over the internet ('the cloud') to offer faster innovation, flexible resources, and economies of scale."),
                            lst("IaaS (Infrastructure as a Service): Rent raw virtual machines, networks, and storage (AWS EC2, Google Compute Engine). You manage OS and software.",
                                "PaaS (Platform as a Service): Cloud provider manages OS, runtime, and hardware; you simply upload application code (Heroku, AWS Elastic Beanstalk).",
                                "SaaS (Software as a Service): Complete end-user software delivered over the web (Gmail, Salesforce, Microsoft 365)."),
                            heading("The Shared Responsibility Model"),
                            text("Security 'OF' the cloud is the cloud provider's job (physical data centers, hypervisors, hardware). Security 'IN' the cloud is YOUR responsibility (data encryption, firewall rules, OS patches, IAM permissions)."),
                            tip("Always design for failure: distribute resources across multiple Availability Zones (AZs) within a region to ensure high availability."),
                            example("Real-world: Netflix hosts entire streaming media microservices on AWS across dozens of Availability Zones to withstand data center power cuts."),
                            practice("Under IaaS, who is responsible for operating system security updates?", "The customer is responsible for guest OS patching and firewall configurations."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "Which service model gives the developer the highest control over operating systems and networking?",
                        "options": ["SaaS", "PaaS", "IaaS", "Serverless"],
                        "correct": 2,
                        "explanation": "IaaS provides raw infrastructure where the customer configures OS, network security, and middleware."
                    }
                ]
            },
            {
                "number": 2,
                "title": "Cloud Compute, Storage & Virtual Networks (VPCs)",
                "description": "Virtual Private Clouds (VPCs), subnets, route tables, internet gateways, object storage (S3), and scalable compute fleets.",
                "hours": 5.0,
                "lessons": [
                    {
                        "number": 1,
                        "title": "Virtual Private Clouds (VPC) & Subnet Isolation",
                        "minutes": 30,
                        "content": blocks(
                            heading("Isolated Cloud Networks"),
                            text("A Virtual Private Cloud (VPC) is your isolated virtual network in the cloud. It closely resembles a traditional physical data center network, but with the benefits of cloud scalability."),
                            lst("Public Subnets: Have route tables pointing to an Internet Gateway (IGW); used for public load balancers and web servers.",
                                "Private Subnets: No direct internet ingress; used for backend APIs and production databases.",
                                "NAT Gateway: Allows private subnet instances to make outbound internet requests (for OS updates) without accepting inbound connections."),
                            code("# AWS CLI example: Creating an S3 bucket with encryption\naws s3api create-bucket --bucket my-app-assets-prod --region us-east-1\naws s3api put-bucket-encryption --bucket my-app-assets-prod \\\n  --server-side-encryption-configuration '{\"Rules\": [{\"ApplyServerSideEncryptionByDefault\": {\"SSEAlgorithm\": \"AES256\"}}]}'", "bash"),
                            tip("Never place production databases in public subnets! Keep databases strictly in private subnets accessible only by application servers."),
                            practice("What cloud component allows private subnet EC2 instances to download security patches?", "A NAT Gateway or NAT Instance in a public subnet."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "What is the primary storage type of AWS S3 and Google Cloud Storage?",
                        "options": ["Block Storage", "Object Storage", "File System", "Relational Database"],
                        "correct": 1,
                        "explanation": "S3 is an Object Storage system storing binary blobs addressed via unique HTTP URLs with unlimited scale."
                    }
                ]
            }
        ],
        "project": {
            "title": "Multi-Tier Cloud Application Architecture",
            "description": "Architect a resilient multi-tier web application with public load balancing, auto-scaled compute in private subnets, S3 object storage, and managed databases.",
            "objective": "Design and validate a production-ready cloud architecture adhering to the AWS Well-Architected Framework.",
            "requirements": ["VPC with public and private subnets across 2 AZs", "S3 bucket with encrypted storage", "Application Load Balancer configuration", "IAM Least Privilege security policy"],
            "steps": [
                {"step": 1, "title": "Network Design", "content": "Establish CIDR block, subnets, route tables, and Internet Gateway."},
                {"step": 2, "title": "Compute Layer", "content": "Configure compute instances with auto-scaling rules behind load balancer."},
                {"step": 3, "title": "Storage Layer", "content": "Provision private database and asset S3 bucket."},
                {"step": 4, "title": "Security Audit", "content": "Enforce IAM roles and security group ingress/egress rules."}
            ],
            "expected_output": "Fully documented and tested multi-tier cloud infrastructure architecture.",
            "difficulty": "intermediate"
        }
    },

    # ─── 4. Linux & System Administration ───────────────────────────────────
    {
        "slug": "linux-system-administration",
        "title": "Linux & System Administration",
        "description": "Master Linux operating system internals, command-line mastery, POSIX file permissions, process management, shell scripting, systemd daemons, and server security hardening.",
        "difficulty": "beginner",
        "duration_weeks": 5,
        "category": "systems",
        "skills_gained": ["Bash Shell Commands", "Permissions & ACLs", "Process Monitoring (systemd)", "Shell Scripting", "SSH & Server Hardening"],
        "prerequisites_text": "Basic computer operation and terminal awareness.",
        "modules": [
            {
                "number": 1,
                "title": "Linux Operating System Fundamentals & Terminal Mastery",
                "description": "Filesystem hierarchy (/etc, /var, /usr), essential command-line tools, pipe redirection, and regex filtering.",
                "hours": 4.0,
                "lessons": [
                    {
                        "number": 1,
                        "title": "The Linux Filesystem Hierarchy & Core Utilities",
                        "minutes": 25,
                        "content": blocks(
                            heading("Everything is a File in Linux"),
                            text("Linux organizes its entire operating system into a single hierarchical directory tree starting at the root directory (/). Devices, sockets, running processes, and disks are all represented as files in the virtual filesystem."),
                            lst("/bin & /usr/bin: Essential user binary command executables.",
                                "/etc: System-wide configuration files (nginx.conf, passwd, hosts).",
                                "/var: Variable runtime data (logs in /var/log, databases in /var/lib).",
                                "/proc: Virtual filesystem exposing kernel and process state metrics."),
                            code("# Powerful command-line piping and filtering\n# Find top 5 memory-consuming processes\nps aux --sort=-%mem | head -n 6\n\n# Search error occurrences in system logs\ngrep -rn 'ERROR' /var/log/nginx/ | wc -l", "bash"),
                            tip("Master pipes (|) and redirections (>, >>, 2>&1). They allow you to chain small single-purpose UNIX utilities into powerful data processing pipelines."),
                            warn("Never execute rm -rf / --no-preserve-root. In Linux, root permissions execute commands with zero safety prompts."),
                            practice("What command displays free disk space in human-readable format?", "df -h (disk free -human)"),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "Which directory contains system configuration files in standard Linux distributions?",
                        "options": ["/var", "/etc", "/usr", "/tmp"],
                        "correct": 1,
                        "explanation": "/etc houses machine-local configuration files for system services and networking."
                    }
                ]
            },
            {
                "number": 2,
                "title": "File Permissions, Ownership & User Management",
                "description": "Read/write/execute permissions, octal representations (chmod 755), sudo elevation, user groups, and SSH keys.",
                "hours": 4.5,
                "lessons": [
                    {
                        "number": 1,
                        "title": "POSIX Permissions & Secure SSH Key Authentication",
                        "minutes": 30,
                        "content": blocks(
                            heading("Understanding Linux Permission Bits"),
                            text("Every file and directory in Linux has an owner user, an owner group, and access permission triads for User (u), Group (g), and Others (o). Each triad contains Read (r=4), Write (w=2), and Execute (x=1)."),
                            code("# Setting file permissions\nchmod 600 ~/.ssh/id_rsa       # Read/Write for owner only\nchmod 644 ~/.ssh/id_rsa.pub   # Read/Write for owner, Read for world\nchmod 755 /usr/local/bin/run  # rwx for owner, rx for others\n\n# Change file ownership\nchown -R www-data:www-data /var/www/html", "bash"),
                            tip("Always disable password authentication on SSH servers! Edit /etc/ssh/sshd_config to set PasswordAuthentication no and use Ed25519 or RSA public keys."),
                            practice("What permissions does chmod 700 grant?", "Read, write, and execute for file owner only; zero access for group or others."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "What is the numeric octal representation of read and write permissions (rw-)?",
                        "options": ["4", "5", "6", "7"],
                        "correct": 2,
                        "explanation": "Read is 4 and Write is 2; 4 + 2 = 6."
                    }
                ]
            }
        ],
        "project": {
            "title": "Production Linux Server Automated Provisioner",
            "description": "Build an automated Bash shell script that hardens an Ubuntu server, provisions a non-root sudo user, installs firewall rules (UFW), and sets up automated log rotation.",
            "objective": "Transform a raw cloud Linux virtual machine into a secured, production-ready server hosting environment.",
            "requirements": ["Automated user & SSH key provisioning", "Fail2ban and UFW firewall configuration", "Automated system backup cron job", "Shell script with robust error handling (set -euo pipefail)"],
            "steps": [
                {"step": 1, "title": "Script Initialization", "content": "Create bootstrap.sh with safety bash flags and logging output."},
                {"step": 2, "title": "User Hardening", "content": "Create deploy user, inject public SSH key, and disable root SSH login."},
                {"step": 3, "title": "Firewall Setup", "content": "Open ports 22, 80, 443 with UFW and enable rate-limiting."},
                {"step": 4, "title": "Verification", "content": "Validate security posture and automated cron backups."}
            ],
            "expected_output": "Executable bootstrap.sh script provisioning hardened servers in under 60 seconds.",
            "difficulty": "intermediate"
        }
    },

    # ─── 5. DevOps ──────────────────────────────────────────────────────────
    {
        "slug": "devops-engineering",
        "title": "DevOps & CI/CD Engineering",
        "description": "Bridge development and IT operations through continuous integration, Docker containers, Kubernetes orchestration, Infrastructure as Code, and production observability.",
        "difficulty": "intermediate",
        "duration_weeks": 7,
        "category": "cloud",
        "skills_gained": ["Docker Containers", "CI/CD Pipelines", "Kubernetes Pods & Services", "Infrastructure as Code", "Prometheus & Grafana"],
        "prerequisites_text": "Familiarity with Git and basic Linux command-line commands.",
        "modules": [
            {
                "number": 1,
                "title": "DevOps Lifecycle & Continuous Integration (CI/CD)",
                "description": "Eliminate deployment silos, automate testing pipelines, and build continuous delivery workflows with GitHub Actions.",
                "hours": 5.0,
                "lessons": [
                    {
                        "number": 1,
                        "title": "Designing Robust CI/CD Delivery Pipelines",
                        "minutes": 30,
                        "content": blocks(
                            heading("What is Continuous Integration & Deployment?"),
                            text("Continuous Integration (CI) is the practice of automatically building and testing code on every single commit. Continuous Delivery (CD) ensures the software can be released to production at any moment through automated staging deployments."),
                            code("# .github/workflows/deploy.yml\nname: CI/CD Pipeline\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: { python-version: '3.11' }\n      - run: pip install -r requirements.txt\n      - run: pytest --cov=app\n  deploy:\n    needs: test\n    if: github.ref == 'refs/heads/main'\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo 'Deploying to production cluster...'", "yaml"),
                            tip("Keep CI feedback loops fast! If test suites take over 10 minutes, developers stop checking results before context switching. Use caching and parallel matrix jobs."),
                            practice("What is the difference between Continuous Delivery and Continuous Deployment?", "Continuous Delivery automatically deploys to staging and prepares release; Continuous Deployment ships directly to production with zero human gate."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "What is the primary objective of Continuous Integration?",
                        "options": ["Manual code reviews", "Merging and automatically validating code frequently", "Writing user documentation", "Designing database schemas"],
                        "correct": 1,
                        "explanation": "CI automatically verifies that recent changes do not break existing software through automated test runs."
                    }
                ]
            },
            {
                "number": 2,
                "title": "Containerization with Docker & Multi-Stage Builds",
                "description": "Docker images, container runtimes, layered caching, docker-compose, and building minimal lightweight container images.",
                "hours": 5.5,
                "lessons": [
                    {
                        "number": 1,
                        "title": "Production Dockerfiles & Multi-Stage Image Optimization",
                        "minutes": 30,
                        "content": blocks(
                            heading("Containerization Principles"),
                            text("Docker isolates application code, dependencies, and system libraries into an immutable container image. This eliminates the notorious 'it works on my machine' defect across developer laptops and production servers."),
                            code("# Multi-stage build for minimal production footprint\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Lean production runner\nFROM nginx:alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html\nEXPOSE 80\nCMD [\"nginx\", \"-g\", \"daemon off;\"]", "dockerfile"),
                            tip("Order Dockerfile instructions from least frequently changed to most frequently changed to maximize Docker layer cache hits!"),
                            warn("Never run containers as root user in production! Use USER appuser to minimize privilege escalation attacks if a container is compromised."),
                            practice("Why are multi-stage Docker builds beneficial?", "They separate build tools and SDKs from the final runtime container, slashing image sizes by 80%+."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "Which Docker instruction copies compiled assets from an earlier build stage into a minimal runtime image?",
                        "options": ["COPY --from=stage", "RUN cp", "ADD remote", "IMPORT layer"],
                        "correct": 0,
                        "explanation": "COPY --from=<stage_name> extracts only the needed distribution artifacts into clean slim images."
                    }
                ]
            }
        ],
        "project": {
            "title": "Full GitOps Kubernetes Deployment Pipeline",
            "description": "Containerize a microservice application with Docker, set up a GitHub Actions CI pipeline to build and scan images, and deploy to Kubernetes manifests.",
            "objective": "Implement an automated end-to-end DevOps pipeline from code commit to zero-downtime rolling deployment.",
            "requirements": ["Dockerized microservice with health checks", "GitHub Actions pipeline with security vulnerability scanning", "Kubernetes Deployment, Service, and Ingress manifests", "Zero-downtime rolling update configuration"],
            "steps": [
                {"step": 1, "title": "Dockerfile Creation", "content": "Write multi-stage Dockerfile and test local docker-compose stack."},
                {"step": 2, "title": "CI Automation", "content": "Configure GitHub Actions to test code, build image, and push to container registry."},
                {"step": 3, "title": "K8s Manifests", "content": "Write Kubernetes Deployment manifests with resource limits and readiness probes."},
                {"step": 4, "title": "Rolling Update Test", "content": "Execute a rolling update and verify zero dropped client connections."}
            ],
            "expected_output": "Fully automated GitOps continuous deployment pipeline with zero downtime.",
            "difficulty": "advanced"
        }
    },

    # ─── 6. Cybersecurity Fundamentals ──────────────────────────────────────
    {
        "slug": "cybersecurity-fundamentals",
        "title": "Cybersecurity Fundamentals",
        "description": "Understand core information security principles (CIA Triad), common cyber threats, malware analysis, network defense, authentication, cryptography, web application security (OWASP Top 10), and SOC incident response.",
        "difficulty": "beginner",
        "duration_weeks": 6,
        "category": "security",
        "skills_gained": ["CIA Security Triad", "Threat Analysis & Malware", "Cryptography (AES/RSA)", "OWASP Top 10", "Incident Response & SOC"],
        "prerequisites_text": "Basic understanding of computer networks and web technologies.",
        "modules": [
            {
                "number": 1,
                "title": "Cyber Threat Landscape & Security Architecture",
                "description": "The CIA Triad (Confidentiality, Integrity, Availability), attack vectors, ransomware, phishing, and zero-day exploits.",
                "hours": 4.5,
                "lessons": [
                    {
                        "number": 1,
                        "title": "The CIA Triad and Threat Modeling",
                        "minutes": 25,
                        "content": blocks(
                            heading("The Foundation of Information Security"),
                            text("All cybersecurity policies, mechanisms, and architectures are evaluated against the CIA Triad: Confidentiality (data is protected from unauthorized eyes), Integrity (data cannot be altered or tampered with undetected), and Availability (authorized users have reliable access when needed)."),
                            lst("Confidentiality: Enforced via encryption, access control lists, and MFA.",
                                "Integrity: Enforced via cryptographic hash functions (SHA-256) and digital signatures.",
                                "Availability: Enforced via redundant hardware, DDoS mitigation, and disaster backups."),
                            heading("Threat Modeling & Attack Surfaces"),
                            text("Threat modeling is the proactive process of identifying security objectives, inventorying vulnerabilities, and defining countermeasures before attackers exploit them."),
                            tip("Security is a process, not a product. Systems are only as secure as their weakest human or configuration link."),
                            example("Real-world: Ransomware attacks strike the Availability pillar by encrypting corporate databases and demanding extortion fees for decryption keys."),
                            practice("Which pillar of the CIA triad is violated when a man-in-the-middle alters the balance in a bank transfer packet?", "Integrity."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "Which principle guarantees that data cannot be modified in transit without detection?",
                        "options": ["Confidentiality", "Integrity", "Availability", "Non-repudiation"],
                        "correct": 1,
                        "explanation": "Integrity guarantees data trustworthiness and lack of tampering using cryptographic checks."
                    }
                ]
            },
            {
                "number": 2,
                "title": "Web Application Security & OWASP Top 10",
                "description": "Analyze common vulnerabilities including SQL Injection, Cross-Site Scripting (XSS), Broken Access Control, and CSRF.",
                "hours": 5.0,
                "lessons": [
                    {
                        "number": 1,
                        "title": "SQL Injection (SQLi) & Cross-Site Scripting (XSS)",
                        "minutes": 30,
                        "content": blocks(
                            heading("Preventing Injection Attacks"),
                            text("SQL Injection occurs when untrusted user input is directly concatenated into a dynamic database query string, allowing attackers to execute arbitrary SQL commands to dump or delete data."),
                            code("# VULNERABLE CODE:\n# query = f\"SELECT * FROM users WHERE username = '{user_input}'\"\n# If input is: admin' OR '1'='1\n\n# SECURE CODE: Always use Parameterized Queries (Prepared Statements)\ncursor.execute(\"SELECT * FROM users WHERE username = ?\", (user_input,))", "python"),
                            heading("Cross-Site Scripting (XSS)"),
                            text("XSS occurs when an application includes untrusted data in a web page without proper HTML sanitization or escaping, allowing malicious JavaScript to execute in victims' browsers and steal session cookies."),
                            tip("Always use Content Security Policy (CSP) headers and set session cookies with the HttpOnly flag so JavaScript cannot read authorization tokens."),
                            warn("Never trust input from users or client headers! Sanitize, validate, and escape every single payload."),
                            practice("How do parameterized queries prevent SQL injection?", "They separate SQL command structure from user data literals, so the database engine never interprets data as executable SQL commands."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "What is the primary defense against SQL Injection vulnerabilities?",
                        "options": ["Client-side validation", "Parameterized queries / Prepared statements", "Hiding database error messages", "Using HTTPS"],
                        "correct": 1,
                        "explanation": "Parameterized queries treat user input strictly as data values, preventing SQL parser interpretation."
                    }
                ]
            }
        ],
        "project": {
            "title": "Web Security Audit & Vulnerability Remediation",
            "description": "Analyze an intentionally vulnerable web application, perform penetration testing to identify OWASP vulnerabilities, and write patches to remediate them.",
            "objective": "Perform black-box vulnerability discovery followed by white-box defensive source code patching.",
            "requirements": ["Discovery of SQL Injection and XSS vectors", "Security report with reproduction steps", "Code patches using parameterized queries and HTML escaping", "Verification tests proving vulnerability closure"],
            "steps": [
                {"step": 1, "title": "Reconnaissance", "content": "Map out input endpoints and parameter reflections."},
                {"step": 2, "title": "Exploit Verification", "content": "Safely prove injection vulnerabilities with test payloads."},
                {"step": 3, "title": "Code Patching", "content": "Refactor codebase to use prepared statements and CSP headers."},
                {"step": 4, "title": "Audit Report", "content": "Draft formal remediation summary detailing CVE mitigation."}
            ],
            "expected_output": "Comprehensive vulnerability remediation report with passing automated security tests.",
            "difficulty": "intermediate"
        }
    },

    # ─── 7. Software Engineering ────────────────────────────────────────────
    {
        "slug": "software-engineering",
        "title": "Software Engineering & System Design",
        "description": "Understand professional software development lifecycles (SDLC), Agile and Scrum methodologies, design patterns (SOLID), scalable system architecture, and robust automated testing.",
        "difficulty": "intermediate",
        "duration_weeks": 6,
        "category": "programming",
        "skills_gained": ["SDLC & Agile Scrum", "SOLID Principles", "System Design Patterns", "Automated Testing", "Code Reviews & Refactoring"],
        "prerequisites_text": "Proficiency in object-oriented programming (Python, Java, or TypeScript).",
        "modules": [
            {
                "number": 1,
                "title": "Software Development Life Cycle & Agile Engineering",
                "description": "Waterfall vs Agile, Scrum sprint ceremonies, user stories, requirements gathering, and technical debt management.",
                "hours": 4.0,
                "lessons": [
                    {
                        "number": 1,
                        "title": "SDLC Stages and Agile Scrum Methodologies",
                        "minutes": 25,
                        "content": blocks(
                            heading("The Engineering Lifecycle"),
                            text("Professional software development follows systematic phases: Requirements Analysis → System Design → Implementation → Automated Testing → Deployment → Maintenance. Modern organizations use Agile/Scrum iterations (1-2 week sprints) to deliver incremental customer value rapidly."),
                            lst("Sprint Planning: Selecting and sizing backlog user stories.",
                                "Daily Standup: 15-minute sync on yesterday's progress, today's focus, and blockers.",
                                "Sprint Review & Demo: Presenting working features to stakeholders.",
                                "Retrospective: Inspecting team process and agreeing on improvements."),
                            tip("Measure features by user value rather than raw lines of code written. Clear specifications reduce rework by up to 50%."),
                            practice("What is technical debt in software development?", "The implied future cost of additional rework caused by choosing an easy, short-term implementation over a clean, robust design."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "Which Agile ceremony focuses specifically on improving team processes after a sprint?",
                        "options": ["Daily Standup", "Sprint Retrospective", "Sprint Planning", "Backlog Grooming"],
                        "correct": 1,
                        "explanation": "The Retrospective provides a structured space for teams to analyze what went well and iterate on team collaboration."
                    }
                ]
            },
            {
                "number": 2,
                "title": "System Design Fundamentals & SOLID Architecture",
                "description": "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion, and Microservice patterns.",
                "hours": 5.0,
                "lessons": [
                    {
                        "number": 1,
                        "title": "The SOLID Principles of Object-Oriented Design",
                        "minutes": 30,
                        "content": blocks(
                            heading("Building Maintainable Systems with SOLID"),
                            text("Robert C. Martin's SOLID principles guide engineers in creating modular software that is easy to extend, test, and refactor over time."),
                            lst("S - Single Responsibility: A class should have one, and only one, reason to change.",
                                "O - Open/Closed: Software entities should be open for extension, but closed for modification.",
                                "L - Liskov Substitution: Subtypes must be substitutable for their base types without altering correctness.",
                                "I - Interface Segregation: Clients should not be forced to depend upon interfaces they do not use.",
                                "D - Dependency Inversion: Depend upon abstractions (interfaces), not concrete implementations."),
                            code("# Dependency Inversion Principle Example\nclass NotificationService:\n    # Depends on abstraction (sender), not a hardcoded email client\n    def __init__(self, sender: MessageSender):\n        self.sender = sender\n        \n    def notify(self, user, message):\n        self.sender.send(user, message)", "python"),
                            tip("Use Dependency Injection to pass database connectors and external clients into classes. This makes mocking during unit tests trivial!"),
                            practice("What does the Open/Closed Principle recommend?", "Designing modules so new behavior can be added via new classes or plugins without editing and risking regression in existing code."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "Which principle states that high-level modules should not depend directly on low-level concrete implementations?",
                        "options": ["Single Responsibility", "Liskov Substitution", "Dependency Inversion", "Interface Segregation"],
                        "correct": 2,
                        "explanation": "Dependency Inversion requires both high-level and low-level modules to depend on abstract interfaces."
                    }
                ]
            }
        ],
        "project": {
            "title": "Modular E-Commerce Order Processing Engine",
            "description": "Design an extensible order processing pipeline following SOLID principles with automated payment gateways, inventory reserve, and unit test suites.",
            "objective": "Build production-quality software architecture demonstrating clean abstractions and high test coverage.",
            "requirements": ["Clean domain model with SOLID abstractions", "Pluggable payment processors (Stripe/PayPal)", "Comprehensive unit and integration test suite", "Architecture design document with UML class diagram"],
            "steps": [
                {"step": 1, "title": "Domain Modeling", "content": "Establish Order, Item, Customer entities and interfaces."},
                {"step": 2, "title": "Service Implementation", "content": "Implement OrderService with dependency injection."},
                {"step": 3, "title": "Testing", "content": "Write unit tests with mock payment gateways achieving 90%+ branch coverage."},
                {"step": 4, "title": "Documentation", "content": "Draft architecture decisions and extension guidelines."}
            ],
            "expected_output": "Clean, modular, thoroughly tested order processing software package.",
            "difficulty": "intermediate"
        }
    },

    # ─── 8. Mobile App Development ──────────────────────────────────────────
    {
        "slug": "mobile-app-development",
        "title": "Mobile App Development",
        "description": "Build responsive, cross-platform mobile applications from scratch. Master mobile UI/UX layouts, state management, REST API integration, device hardware permissions, offline persistence, and app store deployment.",
        "difficulty": "beginner",
        "duration_weeks": 7,
        "category": "mobile",
        "skills_gained": ["Mobile UI/UX Layouts", "React Native / Android", "Navigation & State", "Offline Storage & SQLite", "App Store Deployment"],
        "prerequisites_text": "Basic knowledge of JavaScript or modern programming principles.",
        "modules": [
            {
                "number": 1,
                "title": "Mobile App Architecture & Layout Fundamentals",
                "description": "Mobile screen lifecycles, touch gesture interactions, responsive flex layouts for phones and tablets, and native components.",
                "hours": 4.5,
                "lessons": [
                    {
                        "number": 1,
                        "title": "Mobile App Lifecycles and Touch Gestures",
                        "minutes": 25,
                        "content": blocks(
                            heading("Mobile Computing Constraints"),
                            text("Mobile applications operate under unique hardware constraints: intermittent cellular connectivity, battery conservation, limited RAM, dynamic screen rotations, and aggressive operating system background process terminations."),
                            lst("Active/Foreground: The user is actively interacting with the screen.",
                                "Inactive/Background: The app is paused (e.g., incoming phone call or home button pressed).",
                                "Suspended: App is kept in memory but executes no CPU code to conserve battery.",
                                "Terminated: Operating system evicted app to reclaim memory for other tasks."),
                            code("// React Native Component with Flexbox Layout\nimport React from 'react';\nimport { View, Text, StyleSheet, TouchableOpacity } from 'react-native';\n\nexport default function ActionButton({ label, onPress }) {\n  return (\n    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>\n      <Text style={styles.text}>{label}</Text>\n    </TouchableOpacity>\n  );\n}\n\nconst styles = StyleSheet.create({\n  button: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 12, alignItems: 'center' },\n  text: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 }\n});", "javascript"),
                            tip("Always design touch targets to be at least 48x48dp (display points) to accommodate real human fingers and prevent accidental taps."),
                            practice("What occurs when a mobile app in the background exhausts device memory?", "The mobile OS terminates the process without saving state unless the developer serialized state to local storage."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "What is the recommended minimum touch target size for mobile UI elements?",
                        "options": ["16x16 dp", "24x24 dp", "48x48 dp", "100x100 dp"],
                        "correct": 2,
                        "explanation": "Apple and Google accessibility guidelines recommend a minimum 44-48dp touch target size."
                    }
                ]
            },
            {
                "number": 2,
                "title": "Navigation, State Management & Local Storage",
                "description": "Stack, Tab, and Drawer navigators, global state, offline caching with SQLite / AsyncStorage, and background notifications.",
                "hours": 5.5,
                "lessons": [
                    {
                        "number": 1,
                        "title": "Screen Navigation Stacks and Offline Persistence",
                        "minutes": 30,
                        "content": blocks(
                            heading("Navigation Paradigms in Mobile"),
                            text("Mobile applications rely on hierarchical navigation stacks: pushing a new screen onto the stack slides it in, and popping it returns to the parent screen. Tab bars provide instant switching across top-level views."),
                            code("// Fetching and caching remote API data for offline use\nimport AsyncStorage from '@react-native-async-storage/async-storage';\n\nasync function saveUserData(user) {\n  try {\n    await AsyncStorage.setItem('@user_cache', JSON.stringify(user));\n  } catch (err) {\n    console.error('Failed to save offline user cache', err);\n  }\n}", "javascript"),
                            tip("Always show optimistic UI updates when users submit forms on mobile, then sync in the background to make the app feel instant!"),
                            practice("Why is local storage critical in mobile applications?", "Mobile users frequently lose signal; caching allows apps to function offline and sync when reconnected."),
                        )
                    }
                ],
                "quiz": [
                    {
                        "question": "Which mobile navigation paradigm is best suited for top-level destination switching (Home, Search, Profile)?",
                        "options": ["Modal Stack", "Bottom Tab Navigator", "Deep Link", "Alert Dialog"],
                        "correct": 1,
                        "explanation": "Bottom Tab Navigators provide persistent, ergonomic one-thumb access to core app sections."
                    }
                ]
            }
        ],
        "project": {
            "title": "Offline-First Mobile Task & Habit Tracker",
            "description": "Build an offline-first mobile application featuring bottom tab navigation, persistent local storage, push notification reminders, and dark mode theming.",
            "objective": "Deliver a fully responsive mobile application ready for release on Android and iOS.",
            "requirements": ["Multi-screen navigation with tabs and modals", "Offline data persistence using local storage", "REST API synchronization with retry logic", "Production release APK build"],
            "steps": [
                {"step": 1, "title": "Scaffolding", "content": "Set up project structure and bottom tab navigation."},
                {"step": 2, "title": "UI Components", "content": "Construct responsive task cards, progress rings, and forms."},
                {"step": 3, "title": "Persistence", "content": "Wire local storage for instant offline read and write."},
                {"step": 4, "title": "Release Build", "content": "Bundle assets and generate signed release binary."}
            ],
            "expected_output": "Fully functioning offline-first mobile app ready for simulator or device testing.",
            "difficulty": "intermediate"
        }
    }
]

def run_seed():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Verify existing courses
    existing_slugs = set(r[0] for r in cursor.execute("SELECT slug FROM courses").fetchall())
    print(f"Existing courses in database ({len(existing_slugs)}):", existing_slugs)

    added_count = 0
    skipped_count = 0

    for c in NEW_COURSES:
        if c["slug"] in existing_slugs:
            print(f"  ⏭️  Skipping '{c['title']}' ({c['slug']}) — already exists.")
            skipped_count += 1
            continue

        course_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        total_lessons = sum(len(m["lessons"]) for m in c["modules"])

        cursor.execute("""
            INSERT INTO courses (
                id, slug, title, description, difficulty, duration_weeks,
                num_modules, num_lessons, prerequisites_text, skills_gained_json,
                category, is_published, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            course_id, c["slug"], c["title"], c["description"], c["difficulty"],
            c["duration_weeks"], len(c["modules"]), total_lessons,
            c["prerequisites_text"], json.dumps(c["skills_gained"]),
            c["category"], 1, now
        ))

        for m in c["modules"]:
            module_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO course_modules (
                    id, course_id, module_number, title, description,
                    estimated_hours, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                module_id, course_id, m["number"], m["title"],
                m["description"], m["hours"], now
            ))

            for l in m["lessons"]:
                lesson_id = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO lessons (
                        id, module_id, course_id, lesson_number, title,
                        content_blocks_json, estimated_minutes, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    lesson_id, module_id, course_id, l["number"], l["title"],
                    l["content"], l["minutes"], now
                ))

            for q in m.get("quiz", []):
                quiz_id = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO quiz_questions (
                        id, module_id, question, question_type, options_json,
                        correct_answer, explanation, points, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    quiz_id, module_id, q["question"], "mcq",
                    json.dumps(q["options"]), str(q["correct"]),
                    q["explanation"], 1, now
                ))

        if "project" in c:
            p = c["project"]
            proj_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO projects (
                    id, course_id, title, description, objective,
                    requirements_json, steps_json, expected_output,
                    difficulty, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                proj_id, course_id, p["title"], p["description"], p["objective"],
                json.dumps(p["requirements"]), json.dumps(p["steps"]),
                p["expected_output"], p["difficulty"], now
            ))

        print(f"  [+] Added course: {c['title']} ({len(c['modules'])} modules, {total_lessons} lessons)")
        added_count += 1

    conn.commit()
    conn.close()
    print(f"\nFinished! Added {added_count} new courses. Skipped {skipped_count}.")

if __name__ == "__main__":
    run_seed()
