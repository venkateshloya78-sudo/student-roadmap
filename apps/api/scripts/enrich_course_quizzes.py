"""
enrich_course_quizzes.py — Ensures all courses have 5 rich, high-quality MCQs per module.
"""
import os
import sys
import json
import uuid
import sqlite3
from datetime import datetime, timezone

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'dev.db'))

QUIZ_DATA = {
    # ─── DATA STRUCTURES & ALGORITHMS ──────────────────────────────────────────
    ("data-structures-algorithms", 1): [
        {
            "question": "What is the time complexity of searching an item in a sorted array of size N using binary search?",
            "options": ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
            "correct": 1,
            "explanation": "Binary search divides the search space in half at each step, yielding logarithmic time complexity O(log N)."
        },
        {
            "question": "Which asymptotic notation represents the tight asymptotic upper bound of an algorithm's growth rate?",
            "options": ["Big-O (O)", "Big-Omega (Ω)", "Big-Theta (Θ)", "Little-o (o)"],
            "correct": 0,
            "explanation": "Big-O notation describes the asymptotic upper bound, representing the worst-case scenario for execution time."
        },
        {
            "question": "What is the auxiliary space complexity of standard recursive Depth-First Search on a tree with maximum depth D?",
            "options": ["O(1)", "O(log D)", "O(D)", "O(2^D)"],
            "correct": 2,
            "explanation": "The recursion call stack stores one frame per level down the path, taking O(D) auxiliary space where D is maximum tree depth."
        },
        {
            "question": "Which of the following operations has an amortized O(1) time complexity in dynamic arrays?",
            "options": ["Prepend element at index 0", "Append element at end", "Search for arbitrary value", "Delete element at index 0"],
            "correct": 1,
            "explanation": "Appending to a dynamic array takes O(1) amortized time, because occasional doubling of capacity takes O(N) but happens infrequently."
        },
        {
            "question": "If an algorithm's recurrence relation is T(N) = 2T(N/2) + O(N), what is its overall time complexity by Master Theorem?",
            "options": ["O(N)", "O(N log N)", "O(N^2)", "O(log N)"],
            "correct": 1,
            "explanation": "Case 2 of the Master Theorem applies where a=2, b=2, and f(N)=O(N^1). Since log_b(a) = 1 = k, T(N) = O(N log N), identical to Merge Sort."
        }
    ],
    ("data-structures-algorithms", 2): [
        {
            "question": "Which data structure provides O(1) direct element access by index?",
            "options": ["Singly Linked List", "Static Array", "Doubly Linked List", "Queue"],
            "correct": 1,
            "explanation": "Arrays store items in contiguous memory blocks, allowing direct memory address calculation via base_address + (index * element_size) in O(1) time."
        },
        {
            "question": "What is the time complexity to insert a node at the head of a Singly Linked List?",
            "options": ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
            "correct": 0,
            "explanation": "Inserting at the head requires updating the new node's next pointer to the current head and pointing head to the new node, taking O(1) operations."
        },
        {
            "question": "Which two-pointer technique is optimal for detecting a cycle in a linked list?",
            "options": ["Binary Search Pointers", "Floyd's Tortoise and Hare algorithm", "Sliding Window", "Divide & Conquer"],
            "correct": 1,
            "explanation": "Floyd's cycle detection uses a slow pointer advancing 1 step and a fast pointer advancing 2 steps. If a cycle exists, they are guaranteed to meet."
        },
        {
            "question": "What is the typical time complexity of finding a substring of length M inside a string of length N using the KMP (Knuth-Morris-Pratt) algorithm?",
            "options": ["O(N * M)", "O(N + M)", "O(N log M)", "O(M^2)"],
            "correct": 1,
            "explanation": "KMP precomputes the Longest Prefix Suffix (LPS) array in O(M) and scans text in O(N), giving total linear time O(N + M)."
        },
        {
            "question": "In a Doubly Linked List, how many pointer updates are needed to remove an interior node given its direct node reference?",
            "options": ["1", "2", "4", "N"],
            "correct": 1,
            "explanation": "Updating node.prev.next = node.next and node.next.prev = node.prev takes exactly 2 pointer modifications, completing in O(1) time."
        }
    ],
    ("data-structures-algorithms", 3): [
        {
            "question": "What is the maximum number of nodes in a binary tree of height H (where a single root node has height 1)?",
            "options": ["2^H", "2^H - 1", "2^(H - 1)", "H^2"],
            "correct": 1,
            "explanation": "A full binary tree has 2^0 + 2^1 + ... + 2^(H-1) nodes, which sums up to (2^H) - 1."
        },
        {
            "question": "In a valid Binary Search Tree (BST), what traversal order always produces values in sorted ascending order?",
            "options": ["Pre-order (Root, Left, Right)", "In-order (Left, Root, Right)", "Post-order (Left, Right, Root)", "Level-order (BFS)"],
            "correct": 1,
            "explanation": "In-order traversal visits the left subtree (smaller), then current node, then right subtree (greater), guaranteeing sorted output."
        },
        {
            "question": "What is the time complexity to extract the minimum element from a Min-Heap containing N elements?",
            "options": ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
            "correct": 1,
            "explanation": "Viewing min is O(1), but removing it requires swapping with the last element and running heapify (percolate down), taking O(log N) time."
        },
        {
            "question": "What self-balancing mechanism do AVL trees enforce to maintain O(log N) operations?",
            "options": ["Coloring nodes Red or Black", "Ensuring balance factor |height(left) - height(right)| <= 1", "Always inserting at leaf nodes without rotation", "Storing elements in B-Tree blocks"],
            "correct": 1,
            "explanation": "AVL trees strictly balance heights such that the difference between left and right subtree heights never exceeds 1 via tree rotations."
        },
        {
            "question": "What is the time complexity of building a heap from an unsorted array of N elements using the bottom-up Heapify method?",
            "options": ["O(N log N)", "O(N)", "O(log N)", "O(N^2)"],
            "correct": 1,
            "explanation": "Bottom-up heapify runs in linear O(N) time because lower levels with more nodes require fewer shift-down steps."
        }
    ],

    # ─── GIT & GITHUB ──────────────────────────────────────────────────────────
    ("git-github", 1): [
        {
            "question": "Which command moves modified files from the working directory into the staging area in Git?",
            "options": ["git commit", "git push", "git add", "git checkout"],
            "correct": 2,
            "explanation": "`git add` stages changes into the index, preparing them to be committed into the repository history."
        },
        {
            "question": "What kind of data structure does Git use under the hood to store commit history and object relations?",
            "options": ["Doubly Linked List", "Directed Acyclic Graph (DAG)", "B+ Tree", "Hash Ring"],
            "correct": 1,
            "explanation": "Git represents commits, trees, and blobs as a Directed Acyclic Graph (DAG) with SHA hashes pointing to parent nodes."
        },
        {
            "question": "What does a Git commit SHA-1 or SHA-256 hash represent?",
            "options": ["A random transaction ID", "A cryptographic checksum of the tree, parent commit, author, and commit message", "The current system timestamp only", "The repository URL encoded in hex"],
            "correct": 1,
            "explanation": "Git hashes are deterministic checksums calculated from the commit contents, parent hashes, author metadata, and commit message."
        },
        {
            "question": "Which command allows you to view the exact differences between unstaged modifications and the staged index?",
            "options": ["git status", "git diff", "git log -p", "git show"],
            "correct": 1,
            "explanation": "`git diff` displays unstaged line-by-line differences. Using `git diff --staged` compares staged changes against HEAD."
        },
        {
            "question": "Which file in a repository root instructs Git to ignore untracked files like dependencies and secret keys?",
            "options": [".gitconfig", ".gitignore", ".gitmodules", "config.json"],
            "correct": 1,
            "explanation": "The `.gitignore` file specifies patterns of files and directories that Git should ignore and not track."
        }
    ],
    ("git-github", 2): [
        {
            "question": "What is the primary danger of running `git push --force` on a shared collaborative branch?",
            "options": ["It deletes the local workspace files", "It overwrites remote history, potentially erasing teammates' committed work", "It invalidates GitHub SSH access keys", "It locks the Git repository in read-only mode"],
            "correct": 1,
            "explanation": "`git push --force` replaces the remote branch with local HEAD, wiping out commits made by other contributors. Use `--force-with-lease` instead."
        },
        {
            "question": "What happens during a Fast-Forward merge in Git?",
            "options": ["A new merge commit is created with two parent pointers", "Git simply advances the target branch pointer forward to match the incoming commit", "Git rebases all commits interactively", "Git resolves conflicts automatically with AI"],
            "correct": 1,
            "explanation": "When there are no diverging commits on the destination branch, Git simply moves the branch pointer forward without creating an extra merge commit."
        },
        {
            "question": "When a merge conflict occurs, what Git command aborts the merge and restores the branch to its pre-merge state?",
            "options": ["git merge --abort", "git reset --soft", "git revert HEAD", "git checkout -f"],
            "correct": 0,
            "explanation": "`git merge --abort` immediately rolls back the merge attempt and returns your working tree and index to the state prior to calling git merge."
        },
        {
            "question": "What is the key conceptual difference between `git merge` and `git rebase`?",
            "options": ["Merge only works locally; rebase works remotely", "Merge preserves non-linear history with a merge commit; rebase replays commits on top of base for a linear history", "Rebase creates backup copies of all files", "There is no difference"],
            "correct": 1,
            "explanation": "Merge preserves chronological branch topology, while rebase rewrites commit history onto the latest base commit to keep a clean, linear history."
        },
        {
            "question": "Which command safely shelves uncommitted changes so you can switch branches without committing unfinished work?",
            "options": ["git stash", "git checkout", "git clean", "git commit --amend"],
            "correct": 0,
            "explanation": "`git stash` temporarily shelves (or stashes) changes you've made to your working copy so you can work on something else, and apply them later via `git stash pop`."
        }
    ],

    # ─── CLOUD COMPUTING ───────────────────────────────────────────────────────
    ("cloud-computing", 1): [
        {
            "question": "Which service model gives the developer the highest control over operating systems, storage, and networking?",
            "options": ["SaaS (Software as a Service)", "PaaS (Platform as a Service)", "IaaS (Infrastructure as a Service)", "FaaS (Function as a Service)"],
            "correct": 2,
            "explanation": "IaaS (e.g., AWS EC2, GCP Compute Engine) provides raw virtualized compute, networking, and storage, giving maximum configuration control."
        },
        {
            "question": "Which cloud computing principle automatically scales server instances up or down based on current traffic demands?",
            "options": ["High Availability", "Elasticity & Auto-Scaling", "Fault Tolerance", "Multi-Tenancy"],
            "correct": 1,
            "explanation": "Elasticity allows cloud resources to dynamically expand during traffic spikes and shrink during quiet periods to optimize cost and performance."
        },
        {
            "question": "In the Cloud Shared Responsibility Model, which layer is ALWAYS the customer's responsibility in public cloud deployments?",
            "options": ["Physical datacenter security", "Customer data, access credentials & IAM policies", "Hypervisor virtualization layer", "Server rack cooling and power supply"],
            "correct": 1,
            "explanation": "Customers are always solely responsible for their own data, identity access management (IAM), encryption, and application layer security."
        },
        {
            "question": "What is an AWS Availability Zone (AZ) or GCP Zone?",
            "options": ["A separate geographical continent", "One or more discrete physical data centers with redundant power, networking, and connectivity within a Region", "A software virtualization container", "A private virtual local area network"],
            "correct": 1,
            "explanation": "An Availability Zone consists of one or more isolated physical data centers located in a geographic region, designed to be fault-isolated from other AZs."
        },
        {
            "question": "What is the primary operational advantage of Serverless Computing (FaaS, like AWS Lambda or Cloud Functions)?",
            "options": ["Zero server management, automatic scaling, and billing strictly per millisecond of execution", "Dedicated physical hardware without virtualization", "Continuous 24/7 background CPU usage without timeouts", "Direct root access to host OS kernels"],
            "correct": 0,
            "explanation": "Serverless offloads all OS/patching operations, automatically executes code triggered by events, scales to zero when idle, and bills only for runtime."
        }
    ],
    ("cloud-computing", 2): [
        {
            "question": "What is the primary storage type of AWS S3 and Google Cloud Storage?",
            "options": ["Block Storage (EBS / Persistent Disk)", "Object Storage", "Network File System (EFS / Filestore)", "Relational Database Storage"],
            "correct": 1,
            "explanation": "S3 and GCS are Object Stores, where data is stored as flat immutable objects with unique keys, metadata, and virtually infinite scalability."
        },
        {
            "question": "What is the function of a Virtual Private Cloud (VPC) in cloud infrastructure?",
            "options": ["To store user passwords securely", "To provide an isolated, logically partitioned virtual network for your cloud resources", "To compile source code into Docker images", "To run serverless SQL database queries"],
            "correct": 1,
            "explanation": "A VPC provides an isolated private virtual network where you control IP address ranges, subnets, route tables, and network gateways."
        },
        {
            "question": "What is the purpose of an Internet Gateway (IGW) attached to a public subnet in a VPC?",
            "options": ["To encrypt hard drive volumes", "To enable two-way communication between instances in the VPC and the public Internet", "To run daily automatic backups", "To manage container orchestration"],
            "correct": 1,
            "explanation": "An Internet Gateway is a horizontally scaled, redundant VPC component that routes traffic between your VPC resources and the public Internet."
        },
        {
            "question": "How do Security Groups differ from Network Access Control Lists (NACLs) in AWS VPC architecture?",
            "options": ["Security groups are stateful and operate at the instance level; NACLs are stateless and operate at the subnet level", "Security groups only handle outbound traffic; NACLs handle inbound only", "NACLs are stateful; Security Groups are stateless", "There is no functional difference"],
            "correct": 0,
            "explanation": "Security Groups are stateful firewalls evaluated at the ENI/instance level (return traffic automatically allowed). NACLs are stateless rules at the subnet boundary."
        },
        {
            "question": "Which service distributes incoming application traffic across multiple target instances across different Availability Zones?",
            "options": ["CloudFront Content Delivery Network", "Application Load Balancer (ALB)", "Route 53 DNS Resolver", "Direct Connect Gateway"],
            "correct": 1,
            "explanation": "An Application Load Balancer distributes HTTP/HTTPS traffic across multiple targets (containers, EC2 instances, lambdas) across multiple AZs."
        }
    ],

    # ─── LINUX & SYSTEM ADMINISTRATION ─────────────────────────────────────────
    ("linux-system-administration", 1): [
        {
            "question": "Which directory contains system configuration files in standard Linux distributions?",
            "options": ["/bin", "/etc", "/var", "/usr"],
            "correct": 1,
            "explanation": "The `/etc` directory stores host-specific system-wide configuration files and startup scripts across Linux distributions."
        },
        {
            "question": "Which command displays currently active processes and dynamic real-time resource utilization (CPU and Memory)?",
            "options": ["ls -la", "top / htop", "pwd", "uname -r"],
            "correct": 1,
            "explanation": "`top` and `htop` provide real-time interactive system monitoring, displaying running processes, CPU load, and RAM usage."
        },
        {
            "question": "What is the PID (Process ID) of the primary init process or systemd in Linux?",
            "options": ["0", "1", "100", "65535"],
            "correct": 1,
            "explanation": "PID 1 is reserved for the initial process spawned by the Linux kernel (typically `systemd` or `init`), the ancestor of all user-space processes."
        },
        {
            "question": "What does the pipe operator `|` do in Linux bash shell environments?",
            "options": ["Runs two commands in parallel background threads", "Passes the standard output (stdout) of the first command as standard input (stdin) to the second command", "Redirects error logs to /dev/null", "Terminates the shell session"],
            "correct": 1,
            "explanation": "Piping chains programs together by sending stdout from command 1 directly into the stdin of command 2."
        },
        {
            "question": "Which command searches text files for lines matching a regular expression pattern?",
            "options": ["grep", "find", "locate", "touch"],
            "correct": 0,
            "explanation": "`grep` (Global Regular Expression Print) processes streams or files and outputs lines matching specified patterns."
        }
    ],
    ("linux-system-administration", 2): [
        {
            "question": "What is the numeric octal representation of read and write permissions (rw-)?",
            "options": ["7", "6", "5", "4"],
            "correct": 1,
            "explanation": "In Linux permissions, Read = 4, Write = 2, and Execute = 1. Therefore rw- equals 4 + 2 = 6."
        },
        {
            "question": "What permissions does `chmod 755 script.sh` assign to the owner, group, and others?",
            "options": ["rwx for owner, r-x for group, r-x for others", "rwx for all users", "rw- for owner, r-- for group, --- for others", "r-x for owner, rwx for group and others"],
            "correct": 0,
            "explanation": "7 = rwx (4+2+1), 5 = r-x (4+1), 5 = r-x (4+1). Owner gets full control, while group and others can read and execute."
        },
        {
            "question": "Which command changes the ownership of a file to a new user and group?",
            "options": ["chmod", "chown", "passwd", "usermod"],
            "correct": 1,
            "explanation": "`chown user:group filename` changes the owning user and owning group of specified files or directories."
        },
        {
            "question": "Which system file contains local user accounts and their associated UID, GID, home directory, and login shell?",
            "options": ["/etc/shadow", "/etc/passwd", "/etc/group", "/etc/sudoers"],
            "correct": 1,
            "explanation": "`/etc/passwd` holds essential user account records (UID, GID, home, shell), while hashed passwords are stored securely in `/etc/shadow`."
        },
        {
            "question": "Which command gracefully instructs the `systemd` service manager to restart the Nginx web server?",
            "options": ["service nginx kill", "systemctl restart nginx", "killall -9 nginx", "init 6 nginx"],
            "correct": 1,
            "explanation": "`systemctl restart <unit>` is standard in systemd-based Linux systems to stop and re-launch system services."
        }
    ],

    # ─── DEVOPS & CI/CD ENGINEERING ────────────────────────────────────────────
    ("devops-engineering", 1): [
        {
            "question": "What is the primary objective of Continuous Integration (CI)?",
            "options": ["Automatically deploy code to production every 5 minutes", "Frequently merge developer code into a shared repository and run automated tests on every push", "Replace software developers with AI bots", "Eliminate all staging environments"],
            "correct": 1,
            "explanation": "Continuous Integration automatically validates code changes with automated builds and unit/integration tests as soon as code is pushed."
        },
        {
            "question": "In CI/CD pipeline terminology, what is an 'Artifact'?",
            "options": ["A legacy codebase that needs deletion", "A compiled, packaged binary, test report, or container image produced during pipeline execution", "A hardware server in a datacenter", "A merge conflict resolution note"],
            "correct": 1,
            "explanation": "An artifact is a deployable package (such as a JAR file, Docker image, or tarball) produced by a build stage to be deployed to subsequent environments."
        },
        {
            "question": "What is the difference between Continuous Delivery and Continuous Deployment?",
            "options": ["Continuous Delivery requires manual approval before releasing to production, while Continuous Deployment automatically deploys passing builds directly to production", "Continuous Delivery only tests code; Continuous Deployment builds code", "They are identical terms with no distinction", "Continuous Delivery is for mobile apps only"],
            "correct": 0,
            "explanation": "Continuous Delivery ensures code is always in a releasable state with manual production gate approval; Continuous Deployment deploys every green build automatically."
        },
        {
            "question": "What is the key principle behind Infrastructure as Code (IaC) tools like Terraform?",
            "options": ["Configuring servers manually using web console GUIs", "Defining and managing infrastructure state declaratively using version-controlled configuration files", "Writing code in bash scripts without version control", "Replacing virtual machines with mainframe servers"],
            "correct": 1,
            "explanation": "IaC defines infrastructure (servers, VPCs, databases) in code files, allowing version control, peer review, reproducible builds, and automated drift detection."
        },
        {
            "question": "Which deployment strategy routes a small percentage (e.g., 5%) of live traffic to a new software release to monitor metrics before full rollout?",
            "options": ["Blue/Green Deployment", "Canary Deployment", "Recreate Deployment", "Rolling Update"],
            "correct": 1,
            "explanation": "Canary deployment exposes the new version to a small subset of production traffic to verify stability and error rates before full scale deployment."
        }
    ],
    ("devops-engineering", 2): [
        {
            "question": "Which Docker instruction copies compiled assets from an earlier build stage into a minimal runtime image?",
            "options": ["COPY --from=builder /app/dist /usr/share/nginx/html", "ADD http://remote /app", "RUN cp -r /dist /nginx", "VOLUME /app/dist"],
            "correct": 0,
            "explanation": "Multi-stage Docker builds use `COPY --from=<stage_name>` to extract only final compiled binaries, drastically reducing attack surface and image size."
        },
        {
            "question": "What is the key difference between a Docker Container and a Virtual Machine?",
            "options": ["Containers virtualize hardware and run complete guest operating systems; VMs share the host kernel", "Containers share the host OS kernel and isolate user-space processes; VMs require full hypervisors and separate guest OS kernels", "Containers require gigabytes of RAM to start; VMs boot in milliseconds", "There is no architectural difference"],
            "correct": 1,
            "explanation": "Containers share the host Linux kernel via cgroups and namespaces, making them lightweight and fast to boot compared to hypervisor-based VMs."
        },
        {
            "question": "Which file specifies multi-container Docker applications, defining interconnected services, networks, and volumes in YAML?",
            "options": ["Dockerfile", "docker-compose.yml", "Kubernetes.yaml", "Jenkinsfile"],
            "correct": 1,
            "explanation": "`docker-compose.yml` configures multi-container setups (e.g., web app + Redis + Postgres) to spin up simultaneously with `docker compose up`."
        },
        {
            "question": "In Kubernetes architecture, what is a Pod?",
            "options": ["A physical server rack", "The smallest deployable computing unit in Kubernetes, encapsulating one or more co-located containers sharing network and storage", "A DNS routing table entry", "A cloud provider billing account"],
            "correct": 1,
            "explanation": "A Pod is the fundamental scheduling unit in Kubernetes containing one or more containers that share the same network namespace and IP address."
        },
        {
            "question": "Which Dockerfile instruction specifies the default executable that will run when the container starts?",
            "options": ["RUN", "ENTRYPOINT / CMD", "EXPOSE", "LABEL"],
            "correct": 1,
            "explanation": "`ENTRYPOINT` and `CMD` configure the container's executable process and default parameters when instantiated."
        }
    ],

    # ─── CYBERSECURITY FUNDAMENTALS ────────────────────────────────────────────
    ("cybersecurity-fundamentals", 1): [
        {
            "question": "Which security pillar of the CIA Triad guarantees that data cannot be modified in transit without detection?",
            "options": ["Confidentiality", "Integrity", "Availability", "Non-Repudiation"],
            "correct": 1,
            "explanation": "Integrity ensures data is accurate, complete, and protected against unauthorized tampering or modification, commonly verified with cryptographic hashes."
        },
        {
            "question": "How does Asymmetric Encryption differ from Symmetric Encryption?",
            "options": ["Asymmetric uses the same single secret key for both encryption and decryption", "Asymmetric uses a mathematically linked public-private key pair; symmetric uses a single shared secret key", "Asymmetric encryption cannot encrypt text", "Symmetric encryption is only used for SSL certificates"],
            "correct": 1,
            "explanation": "Asymmetric encryption uses public keys to encrypt and matching private keys to decrypt (e.g. RSA, ECC), solving the key distribution problem."
        },
        {
            "question": "What type of cyber attack floods a web server with an overwhelming volume of bogus traffic to render it inaccessible to legitimate users?",
            "options": ["SQL Injection", "Distributed Denial of Service (DDoS)", "Cross-Site Scripting (XSS)", "Man-in-the-Middle (MitM)"],
            "correct": 1,
            "explanation": "A DDoS attack utilizes distributed botnets to flood network bandwidth or server compute resources, violating Availability."
        },
        {
            "question": "What is the Zero Trust security architecture model summarized as?",
            "options": ["Trust internal network users; verify only external internet traffic", "Never trust, always verify — continuously authenticate and authorize every request regardless of network location", "Rely entirely on perimeter firewalls", "Disable all user passwords and use open networks"],
            "correct": 1,
            "explanation": "Zero Trust operates on the principle that threat actors may already be inside the network, requiring strict identity verification for every access attempt."
        },
        {
            "question": "What is Multi-Factor Authentication (MFA) based on?",
            "options": ["Using two passwords instead of one", "Combining two or more distinct categories: something you know (password), something you have (device/token), and something you are (biometrics)", "Entering an email address twice", "Answering security questions"],
            "correct": 1,
            "explanation": "MFA requires verification across at least two different factor categories (knowledge, possession, or inherence) to prevent credential theft."
        }
    ],
    ("cybersecurity-fundamentals", 2): [
        {
            "question": "What is the primary architectural defense against SQL Injection (SQLi) vulnerabilities in web applications?",
            "options": ["Client-side JavaScript form validation only", "Parameterized queries (Prepared Statements) and ORMs", "Hashing the database password", "Adding CAPTCHA to every web form"],
            "correct": 1,
            "explanation": "Prepared statements separate SQL code structure from user parameters, ensuring that attacker inputs are treated purely as literal data, never executed."
        },
        {
            "question": "What type of attack involves an attacker injecting malicious JavaScript into a web page that executes in other users' browsers?",
            "options": ["Cross-Site Scripting (XSS)", "Cross-Site Request Forgery (CSRF)", "Buffer Overflow", "Server-Side Request Forgery (SSRF)"],
            "correct": 0,
            "explanation": "XSS attacks execute arbitrary scripts in the victim's browser context, enabling session cookie theft, credential theft, and page defacement."
        },
        {
            "question": "What HTTP response header instructs web browsers to only communicate with the server over secure HTTPS connections, preventing SSL stripping?",
            "options": ["Access-Control-Allow-Origin", "Strict-Transport-Security (HSTS)", "Content-Type: application/json", "X-Frame-Options: SAMEORIGIN"],
            "correct": 1,
            "explanation": "HSTS forces user browsers to strictly connect via HTTPS, preventing downgrade attacks and man-in-the-middle sniffing."
        },
        {
            "question": "What is the recommended cryptographic algorithm for securely hashing and salting user passwords?",
            "options": ["MD5", "SHA-1", "bcrypt / Argon2id", "Base64 encoding"],
            "correct": 2,
            "explanation": "bcrypt and Argon2 are slow, memory-hard adaptive hashing algorithms with automatic salting, designed specifically to resist GPU brute-force attacks."
        },
        {
            "question": "How does Cross-Site Request Forgery (CSRF) exploit a logged-in user?",
            "options": ["By stealing the user's password directly from the server database", "By tricking the user's browser into executing unwanted authenticated state-changing requests using existing stored cookies", "By intercepting WiFi packets with Wireshark", "By crashing the backend operating system"],
            "correct": 1,
            "explanation": "CSRF tricks the authenticated browser into submitting unauthorized requests (like funds transfer or password reset) without the user's awareness."
        }
    ],

    # ─── SOFTWARE ENGINEERING & SYSTEM DESIGN ──────────────────────────────────
    ("software-engineering", 1): [
        {
            "question": "Which Agile ceremony focuses specifically on identifying process improvements and what the team should continue or stop doing after a sprint?",
            "options": ["Sprint Planning", "Daily Standup", "Sprint Retrospective", "Backlog Refinement"],
            "correct": 2,
            "explanation": "The Sprint Retrospective provides dedicated time for the scrum team to inspect their process, tools, and dynamics to improve in future iterations."
        },
        {
            "question": "What is the primary difference between Unit Testing and Integration Testing?",
            "options": ["Unit tests test individual functions or components in complete isolation; Integration tests test interactions between cooperating modules or subsystems", "Unit tests require production databases; Integration tests do not", "Integration testing is only performed by end users", "Unit tests only run on compiled C++ code"],
            "correct": 0,
            "explanation": "Unit testing verifies that small, isolated pieces of code (functions, methods) work correctly using mocks; integration testing tests module boundaries."
        },
        {
            "question": "What is the core principle of Test-Driven Development (TDD)?",
            "options": ["Writing documentation after deployment", "Red-Green-Refactor: Write a failing test first, write minimal code to make it pass, then refactor", "Writing all code first, then having QA write tests", "Skipping tests if code compiles without errors"],
            "correct": 1,
            "explanation": "TDD follows Red (write failing test) -> Green (write code to pass) -> Refactor (clean up code while ensuring tests remain green)."
        },
        {
            "question": "In semantic versioning (SemVer: MAJOR.MINOR.PATCH), when should the MAJOR version number be incremented?",
            "options": ["When fixing a minor bug", "When adding backward-compatible new functionality", "When introducing incompatible, breaking API changes", "Every calendar year"],
            "correct": 2,
            "explanation": "Major increments signal breaking changes; Minor signals backward-compatible features; Patch signals backward-compatible bug fixes."
        },
        {
            "question": "What software engineering metric measures the percentage of source code executed during an automated test suite run?",
            "options": ["Cyclomatic Complexity", "Code Coverage", "Technical Debt Ratio", "Mean Time to Recovery (MTTR)"],
            "correct": 1,
            "explanation": "Code Coverage evaluates test completeness by reporting the proportion of lines, branches, or functions traversed by automated tests."
        }
    ],
    ("software-engineering", 2): [
        {
            "question": "Which SOLID principle states that high-level modules should not depend on low-level modules, but rather both should depend on abstractions?",
            "options": ["Single Responsibility Principle (SRP)", "Open/Closed Principle (OCP)", "Liskov Substitution Principle (LSP)", "Dependency Inversion Principle (DIP)"],
            "correct": 3,
            "explanation": "The Dependency Inversion Principle decouples software components by having both depend on shared interfaces rather than direct concrete implementations."
        },
        {
            "question": "According to the Single Responsibility Principle (SRP), why should a class or module have only one reason to change?",
            "options": ["To prevent git conflicts between developers", "To minimize side effects, simplify testing, and increase cohesion and maintainability", "To force all classes to have fewer than 10 lines of code", "To eliminate the need for interfaces"],
            "correct": 1,
            "explanation": "SRP ensures each module does one cohesive task well. When requirements change, only the relevant class is touched, reducing regression bugs."
        },
        {
            "question": "In distributed system design, what does the CAP Theorem state?",
            "options": ["A distributed data store can simultaneously guarantee Consistency, Availability, and Partition Tolerance", "In the presence of a network partition, a distributed system must choose between Consistency or Availability", "Caching, Asynchronous I/O, and Partitioning can always be maximized", "Performance decreases linearly with cluster size"],
            "correct": 1,
            "explanation": "The CAP theorem proves that in the event of network partition (P), a distributed data store can provide either Consistency (CP) or Availability (AP), but not both."
        },
        {
            "question": "What design pattern provides a single point of global access to an object instance and guarantees that only one instance of the class exists?",
            "options": ["Factory Pattern", "Singleton Pattern", "Observer Pattern", "Strategy Pattern"],
            "correct": 1,
            "explanation": "The Singleton pattern restricts class instantiation to a single global instance, commonly used for database connection pools and logging managers."
        },
        {
            "question": "Which architectural pattern separates read operations from write/update operations to enable independent scaling and optimized query schemas?",
            "options": ["Model-View-Controller (MVC)", "CQRS (Command Query Responsibility Segregation)", "Monolithic Architecture", "Peer-to-Peer"],
            "correct": 1,
            "explanation": "CQRS divides data writes (Commands) from data reads (Queries), allowing write models to be normalized and read models to be denormalized for speed."
        }
    ],

    # ─── MOBILE APP DEVELOPMENT ────────────────────────────────────────────────
    ("mobile-app-development", 1): [
        {
            "question": "What is the recommended minimum touch target size for mobile UI interactive elements (buttons, links)?",
            "options": ["12x12 px", "24x24 dp", "48x48 dp / points (approximately 7-9 mm)", "100x100 dp"],
            "correct": 2,
            "explanation": "Both Apple Human Interface and Google Material Design guidelines recommend minimum touch targets of ~48x48 dp to avoid accidental taps."
        },
        {
            "question": "In modern declarative mobile UI frameworks (Flutter, React Native, Jetpack Compose, SwiftUI), how is UI updated?",
            "options": ["Imperatively finding views by ID and mutating text properties", "As a pure function of State: UI = f(State) — mutating state triggers automated framework re-renders", "Reloading the entire operating system", "Running background shell commands"],
            "correct": 1,
            "explanation": "Declarative mobile frameworks automatically re-compute and render the virtual UI hierarchy whenever underlying reactive state changes."
        },
        {
            "question": "What layout mechanism is predominantly used in cross-platform mobile frameworks to arrange children in rows and columns?",
            "options": ["CSS Floats", "Flexbox (Flexible Box Layout)", "HTML Tables", "Absolute pixel positioning"],
            "correct": 1,
            "explanation": "Flexbox (flexDirection, alignItems, justifyContent) provides responsive alignment across diverse mobile screen aspect ratios."
        },
        {
            "question": "What is the main purpose of the mobile Application Lifecycle methods (e.g., onResume, onPause / foreground, background)?",
            "options": ["To charge the user's credit card", "To manage system resources, save user state before termination, and pause battery-draining tasks like GPS", "To increase WiFi upload speeds", "To prevent app updates"],
            "correct": 1,
            "explanation": "Mobile operating systems terminate inactive apps under memory pressure; lifecycle hooks allow saving drafts and pausing intensive tasks."
        },
        {
            "question": "Why should intensive operations (like image processing or network requests) never run on the Mobile Main (UI) Thread?",
            "options": ["It will cause compilation errors", "It blocks the UI frame rate, dropping below 60fps and triggering Application Not Responding (ANR) dialogs", "Mobile devices do not have network hardware on the main thread", "It permanently deletes user files"],
            "correct": 1,
            "explanation": "The main thread handles touch input and screen rendering (16.6ms per frame). Blocking it freezes UI interactions, causing jank or ANR crashes."
        }
    ],
    ("mobile-app-development", 2): [
        {
            "question": "Which mobile navigation paradigm is best suited for top-level destination switching (e.g., Home, Search, Activity, Profile)?",
            "options": ["Stack Navigation only", "Bottom Tab Navigation", "Modal Popups", "Browser address bar"],
            "correct": 1,
            "explanation": "Bottom Tab bars provide ergonomic thumb-reach access for switching between 3-5 primary app destinations."
        },
        {
            "question": "What is the primary difference between Stack Navigation and Tab Navigation?",
            "options": ["Stack navigation pushes screens hierarchically onto a stack (with a Back button); Tab navigation switches between top-level peer views", "Stack navigation cannot accept route parameters", "Tab navigation only works on iOS devices", "Stack navigation only supports 2 screens"],
            "correct": 0,
            "explanation": "Stack navigators follow LIFO order for hierarchical drilling (e.g., Feed -> Post Detail -> Comments), with automatic back transitions."
        },
        {
            "question": "Which storage mechanism is ideal for persisting lightweight mobile key-value preferences (e.g., theme toggle, user auth tokens)?",
            "options": ["Raw text files in /tmp", "AsyncStorage / SharedPreferences / UserDefaults", "A local MongoDB cluster", "Exabyte object storage"],
            "correct": 1,
            "explanation": "Native key-value stores like SharedPreferences (Android) and UserDefaults (iOS) provide instant asynchronous lookup for simple settings and tokens."
        },
        {
            "question": "For complex offline-first mobile apps requiring relational querying of thousands of cached items, what database engine is the industry standard?",
            "options": ["SQLite / Room / Realm", "PostgreSQL Server", "Apache Cassandra", "Redis on localhost"],
            "correct": 0,
            "explanation": "SQLite (embedded via Room on Android, Core Data on iOS, or SQLite wrappers) is the battle-tested local relational database for mobile."
        },
        {
            "question": "Which service architecture delivers real-time Push Notifications to mobile devices when the app is completely closed?",
            "options": ["Local while(true) loops in app code", "Apple Push Notification service (APNs) and Firebase Cloud Messaging (FCM)", "Direct SSH tunnels to user phones", "HTTP polling every 500 milliseconds"],
            "correct": 1,
            "explanation": "APNs and FCM maintain single low-power persistent socket connections to the operating system, waking devices to display alerts without draining battery."
        }
    ],

    # ─── DATA ANALYTICS FUNDAMENTALS ───────────────────────────────────────────
    ("data-analytics", 1): [
        {
            "question": "Which measure of central tendency is least sensitive to extreme outliers in skewed data?",
            "options": ["Mean (Arithmetic Average)", "Median (Middle Value)", "Standard Deviation", "Range"],
            "correct": 1,
            "explanation": "The median divides the sorted distribution in half and is robust against extreme outliers, unlike the mean which is pulled toward skew."
        },
        {
            "question": "What does a Pearson correlation coefficient of -0.85 between variables X and Y indicate?",
            "options": ["No relationship between X and Y", "A strong negative linear relationship: as X increases, Y tends to decrease", "X causes Y to decrease directly", "A calculation error since correlation must be positive"],
            "correct": 1,
            "explanation": "Pearson's r ranges from -1 to +1. A value of -0.85 represents a strong inverse linear association (note: correlation does not imply causation)."
        },
        {
            "question": "What percentage of data values fall within 1 standard deviation of the mean in a perfectly normal (Gaussian) distribution?",
            "options": ["50.0%", "68.2%", "95.4%", "99.7%"],
            "correct": 1,
            "explanation": "According to the 68-95-99.7 empirical rule, approximately 68.2% of data in a normal distribution lies within mean ± 1 standard deviation."
        },
        {
            "question": "What is the difference between descriptive statistics and inferential statistics?",
            "options": ["Descriptive summarizes characteristics of known sample data; Inferential uses sample data to draw conclusions and test hypotheses about a larger population", "Descriptive requires calculus; Inferential only uses addition", "Inferential statistics is only used in computer science", "There is no difference"],
            "correct": 0,
            "explanation": "Descriptive statistics describe and summarize current datasets; inferential statistics use hypothesis tests (p-values, confidence intervals) to infer population parameters."
        },
        {
            "question": "What does a p-value less than 0.05 typically signify in classical hypothesis testing?",
            "options": ["The null hypothesis is proven with 100% certainty", "Statistically significant evidence to reject the null hypothesis at the 5% significance level", "A 95% probability of a calculation error", "The sample size was too small"],
            "correct": 1,
            "explanation": "When p < 0.05, the observed data would be very unlikely under the assumption that the null hypothesis is true, warranting rejection of the null."
        }
    ],
    ("data-analytics", 2): [
        {
            "question": "Which modern Excel formula combines the capabilities of VLOOKUP and HLOOKUP with support for left-lookups and default exact matches?",
            "options": ["XLOOKUP", "INDEX-MATCH only", "COUNTIF", "CONCATENATE"],
            "correct": 0,
            "explanation": "`XLOOKUP` allows searching in any direction (left/right/vertical/horizontal), defaults to exact match, and provides native fallback values."
        },
        {
            "question": "What is the primary purpose of an Excel Pivot Table?",
            "options": ["To write VBA macros", "To quickly aggregate, summarize, slice, and cross-tabulate large tabular datasets without writing formulas", "To create 3D animations", "To connect to external Git repositories"],
            "correct": 1,
            "explanation": "Pivot tables enable interactive aggregation, grouping, and calculation (sums, averages, counts) across multidimensional columns and rows."
        },
        {
            "question": "Which Excel formula sums values in range C2:C100 only if corresponding entries in B2:B100 equal 'Electronics'?",
            "options": ["=SUM(C2:C100)", "=SUMIF(B2:B100, \"Electronics\", C2:C100)", "=COUNTIF(B2:B100, \"Electronics\")", "=IF(B2:B100=\"Electronics\", SUM(C2:C100))"],
            "correct": 1,
            "explanation": "`SUMIF(criteria_range, criteria, sum_range)` sums values conditionally based on the specified logical match."
        },
        {
            "question": "What does the `$` symbol signify in an Excel cell formula reference such as `$A$1`?",
            "options": ["The cell contains currency format", "An absolute reference that locks row and column when copying the formula across cells", "A reference to an external workbook", "A division operator"],
            "correct": 1,
            "explanation": "The `$` locks column and/or row coordinates, preventing Excel from adjusting relative cell offsets when dragging formulas."
        },
        {
            "question": "Which Excel tool identifies and handles duplicate rows, trailing spaces, and standardizes capitalization during data preparation?",
            "options": ["Power Query (Get & Transform)", "Solver Add-in", "Goal Seek", "Format Painter"],
            "correct": 0,
            "explanation": "Power Query is the modern ETL engine built into Excel for importing, transforming, cleansing, and reshaping dirty data pipelines."
        }
    ],
    ("data-analytics", 3): [
        {
            "question": "In Python Pandas, what is the two-dimensional tabular data structure with labeled axes (rows and columns)?",
            "options": ["Series", "DataFrame", "Panel", "Ndarray"],
            "correct": 1,
            "explanation": "A pandas `DataFrame` is the primary 2D data structure with heterogeneous column types and indexed rows and columns."
        },
        {
            "question": "Which Pandas method removes rows containing missing or null (NaN) values?",
            "options": ["df.dropna()", "df.fillna()", "df.isnull()", "df.remove_empty()"],
            "correct": 0,
            "explanation": "`df.dropna()` filters out missing values along axes (rows by default), while `df.fillna(value)` imputes missing entries."
        },
        {
            "question": "How do you filter a DataFrame `df` to keep only rows where the 'age' column is greater than or equal to 18?",
            "options": ["df.filter('age >= 18')", "df[df['age'] >= 18]", "df.where('age >= 18')", "df.select(age >= 18)"],
            "correct": 1,
            "explanation": "Boolean indexing in Pandas passes a boolean condition mask `df['age'] >= 18` inside the bracket operator `df[...]`."
        },
        {
            "question": "Which Pandas operation computes the mean 'salary' grouped by each 'department'?",
            "options": ["df.groupby('department')['salary'].mean()", "df.group('department').salary.avg()", "df.aggregate('department', 'salary', 'mean')", "df.pivot('department', 'salary')"],
            "correct": 0,
            "explanation": "The split-apply-combine idiom `df.groupby('department')['salary'].mean()` partitions data by department and computes the arithmetic mean."
        },
        {
            "question": "What is the difference between `df.loc[]` and `df.iloc[]` in Pandas?",
            "options": ["`df.loc` is label-based indexing; `df.iloc` is integer-position based indexing", "`df.loc` operates on columns only; `df.iloc` operates on rows only", "`df.loc` modifies data in place; `df.iloc` creates a copy", "There is no difference"],
            "correct": 0,
            "explanation": "`.loc` references row labels and column names, while `.iloc` references 0-indexed integer numerical positions."
        }
    ],
    ("data-analytics", 4): [
        {
            "question": "Which chart type is best suited for visualizing the distribution and spread of continuous numerical data, including medians and outliers?",
            "options": ["Pie Chart", "Box Plot (Box-and-Whisker)", "Stacked Bar Chart", "Donut Chart"],
            "correct": 1,
            "explanation": "Box plots display the five-number summary (minimum, Q1, median, Q3, maximum) and clearly flag outliers outside 1.5 * IQR."
        },
        {
            "question": "Why are pie charts generally discouraged for comparing more than 3-4 categories in business intelligence dashboards?",
            "options": ["They take too much computer memory to render", "Human perception struggles to accurately compare angles and slice areas compared to length in bar charts", "Pie charts cannot display percentages", "Coloring pie charts is illegal in UI design"],
            "correct": 1,
            "explanation": "Human visual cognition interprets aligned bar lengths far more accurately than radial angles and slice area differences."
        },
        {
            "question": "In Python visualization, which library provides high-level statistical plots with built-in color themes on top of Matplotlib?",
            "options": ["Seaborn", "NumPy", "Pandas Core", "Scikit-Learn"],
            "correct": 0,
            "explanation": "Seaborn is built directly on Matplotlib and integrates closely with Pandas to provide statistical charts (heatmaps, pairplots, violinplots)."
        },
        {
            "question": "Which plot type is optimal for examining the relationship and potential correlation between two continuous variables?",
            "options": ["Bar Chart", "Scatter Plot", "Pie Chart", "Treemap"],
            "correct": 1,
            "explanation": "A scatter plot plots data points along X and Y axes, revealing correlation patterns, clusters, and bivariate anomalies."
        },
        {
            "question": "What data visualization best practice prevents misleading representations in bar charts?",
            "options": ["Always using 3D perspectives and gradients", "Always starting the quantitative baseline axis at zero", "Randomizing the order of categories", "Omitting axis labels for cleaner look"],
            "correct": 1,
            "explanation": "Truncating the quantitative axis in bar charts distorts visual proportions and exaggerates minor differences; bar charts should always start at zero."
        }
    ],
    ("data-analytics", 5): [
        {
            "question": "What is the primary role of an Executive Summary in a Data Analytics project report?",
            "options": ["To list all raw Python code scripts line-by-line", "To summarize key business questions, core insights, and actionable recommendations in concise business language", "To describe server CPU specifications", "To list database passwords"],
            "correct": 1,
            "explanation": "Executive summaries provide stakeholders and leadership with high-level business takeaways and actionable impact without requiring technical jargon."
        },
        {
            "question": "What does the CRISP-DM framework stand for in industry analytics methodology?",
            "options": ["Computer Routing and Internet Security Protocol", "Cross-Industry Standard Process for Data Mining", "Continuous Real-time Information Stream Platform", "Customer Relationship Intelligence Strategy Project"],
            "correct": 1,
            "explanation": "CRISP-DM consists of 6 phases: Business Understanding, Data Understanding, Data Preparation, Modeling, Evaluation, and Deployment."
        },
        {
            "question": "When presenting data findings to non-technical stakeholders, what should you prioritize?",
            "options": ["Showing maximum lines of SQL and Python syntax", "Focusing on business impact, ROI, key metrics, and actionable decisions supported by clear visuals", "Listing all mathematical equations used", "Using complex statistical jargon without explanations"],
            "correct": 1,
            "explanation": "Stakeholders care about practical impact, actionable insights, risk mitigation, and bottom-line value rather than low-level technical mechanics."
        },
        {
            "question": "What is the main advantage of hosting a data portfolio on GitHub and interactive platforms (like Tableau Public or Streamlit)?",
            "options": ["It guarantees automatic employment", "It provides tangible, verifiable proof of your end-to-end analytical problem-solving skills to recruiters and hiring managers", "It eliminates the need for resume writing", "It automatically runs machine learning models for free"],
            "correct": 1,
            "explanation": "A portfolio of documented projects demonstrates real-world competence: from data cleaning and SQL querying to visualization and business interpretation."
        },
        {
            "question": "What is 'Data Storytelling' in professional analytics?",
            "options": ["Inventing fictional narratives about data", "Synthesizing data, visual narratives, and business context to communicate insights that drive strategic decisions", "Writing fairy tales using AI", "Formatting spreadsheets with bright colors"],
            "correct": 1,
            "explanation": "Data storytelling bridges the gap between raw data and human decision-making by creating a structured narrative around insights and outcomes."
        }
    ],

    # ─── WEB DEVELOPMENT FUNDAMENTALS ──────────────────────────────────────────
    ("web-development", 1): [
        {
            "question": "What is the primary purpose of Semantic HTML elements like `<header>`, `<nav>`, `<main>`, and `<article>`?",
            "options": ["To add automatic CSS animations", "To provide structural meaning to browsers, screen readers, and search engine crawlers", "To run server-side PHP scripts", "To reduce web page bandwidth to zero"],
            "correct": 1,
            "explanation": "Semantic HTML tags convey context and structural hierarchy to assistive technologies (screen readers) and improve SEO rankings."
        },
        {
            "question": "Which HTML tag is used to specify metadata such as character encoding, viewport settings, and document description?",
            "options": ["<meta>", "<link>", "<style>", "<script>"],
            "correct": 0,
            "explanation": "The `<meta>` tag placed inside `<head>` defines character set (`utf-8`), responsive viewport settings, and search engine metadata."
        },
        {
            "question": "What is the purpose of the `alt` attribute on an `<img>` tag?",
            "options": ["To define the image click URL", "To provide alternative descriptive text for visually impaired screen readers and when images fail to load", "To change image brightness", "To crop the image automatically"],
            "correct": 1,
            "explanation": "The `alt` attribute is vital for accessibility (WCAG), conveying the content and function of images to screen reader users."
        },
        {
            "question": "Which HTML attribute associates a `<label>` element with its corresponding `<input>` field?",
            "options": ["name", "for (or htmlFor in JSX)", "target", "rel"],
            "correct": 1,
            "explanation": "The `for` attribute on a label matches the `id` of an input, allowing clicking the label to focus the input field."
        },
        {
            "question": "Which input `type` attribute provides built-in email format validation in HTML5 forms?",
            "options": ["type=\"text\"", "type=\"email\"", "type=\"validate\"", "type=\"string\""],
            "correct": 1,
            "explanation": "`<input type=\"email\">` provides native browser format checking and brings up email-optimized keyboards on mobile devices."
        }
    ],
    ("web-development", 2): [
        {
            "question": "In the CSS Box Model, which layer is positioned between padding and margin?",
            "options": ["Content", "Border", "Outline", "Clip"],
            "correct": 1,
            "explanation": "The CSS box model layers from inside out: Content -> Padding -> Border -> Margin."
        },
        {
            "question": "What does `box-sizing: border-box` do in CSS styling?",
            "options": ["Adds an automatic black border to all elements", "Includes padding and border within the element's total specified width and height", "Removes all margins from child elements", "Forces elements into display: block"],
            "correct": 1,
            "explanation": "`border-box` ensures that declared `width: 300px` encompasses content, padding, and border, preventing layout overflow."
        },
        {
            "question": "Which CSS selector has the highest specificity?",
            "options": ["Tag selector (`p`)", "Class selector (`.highlight`)", "ID selector (`#main-header`)", "Universal selector (`*`)"],
            "correct": 2,
            "explanation": "Specificity ranks from highest to lowest: Inline styles (1000) -> IDs (100) -> Classes/attributes/pseudo-classes (10) -> Elements (1)."
        },
        {
            "question": "Which CSS property is used to specify responsiveness based on viewport dimensions?",
            "options": ["@keyframes", "@media queries", "@import", "@font-face"],
            "correct": 1,
            "explanation": "Media queries (`@media (max-width: 768px)`) apply CSS rules conditionally based on device screen characteristics."
        },
        {
            "question": "What is the difference between `display: none` and `visibility: hidden` in CSS?",
            "options": ["`display: none` removes the element completely from layout flow; `visibility: hidden` hides the element but preserves its space", "`display: none` turns the text white; `visibility: hidden` deletes the HTML", "They are completely identical", "`visibility: hidden` only works on images"],
            "correct": 0,
            "explanation": "`display: none` removes the element from rendering flow; `visibility: hidden` hides it visually while leaving its empty layout box intact."
        }
    ],
    ("web-development", 3): [
        {
            "question": "Which CSS Flexbox property controls alignment along the cross-axis?",
            "options": ["justify-content", "align-items", "flex-direction", "flex-wrap"],
            "correct": 1,
            "explanation": "`justify-content` controls alignment along the main axis; `align-items` controls alignment along the cross axis."
        },
        {
            "question": "How do you define a two-dimensional grid layout in CSS with 3 equal-width columns?",
            "options": ["display: flex; flex-direction: 3-column;", "display: grid; grid-template-columns: repeat(3, 1fr);", "display: table; columns: 3;", "display: inline-block; width: 33.3%;"],
            "correct": 1,
            "explanation": "`grid-template-columns: repeat(3, 1fr)` defines 3 equal fractional tracks in CSS Grid layout."
        },
        {
            "question": "What is the behavior of an element with `position: absolute`?",
            "options": ["It is positioned relative to the browser window and stays fixed on scroll", "It is removed from standard flow and positioned relative to its nearest positioned ancestor", "It cannot have top or left styles", "It behaves like a normal inline element"],
            "correct": 1,
            "explanation": "`position: absolute` positions an element relative to its closest ancestor having non-static position (`relative`, `absolute`, `fixed`)."
        },
        {
            "question": "What is the difference between `position: fixed` and `position: sticky`?",
            "options": ["Fixed is always relative to viewport; sticky scrolls with flow until reaching an offset threshold, then behaves like fixed", "Fixed only works on mobile; sticky works on desktop", "Sticky is deprecated in CSS", "There is no difference"],
            "correct": 0,
            "explanation": "`position: sticky` acts as relative positioning until the viewport scrolls past its trigger position, where it sticks."
        },
        {
            "question": "Which CSS Grid property specifies the spacing between grid rows and columns without using margins?",
            "options": ["grid-margin", "gap (or row-gap / column-gap)", "space-between", "grid-padding"],
            "correct": 1,
            "explanation": "The `gap` property provides clean, uniform gutter spacing between grid cells and flex items without extra perimeter margins."
        }
    ],
    ("web-development", 4): [
        {
            "question": "What is the difference between `let` and `const` in modern JavaScript (ES6+)?",
            "options": ["`let` variables cannot be reassigned; `const` variables can", "`const` variables cannot be reassigned after declaration; `let` variables can be reassigned", "`let` has global scope only; `const` has function scope only", "`const` only stores strings"],
            "correct": 1,
            "explanation": "`const` declares block-scoped read-only identifiers that cannot be reassigned, whereas `let` allows variable reassignment."
        },
        {
            "question": "What is the result of `'5' + 3` versus `'5' - 3` in JavaScript?",
            "options": ["'8' and 2", "'53' and 2", "8 and 2", "'53' and NaN"],
            "correct": 1,
            "explanation": "The `+` operator coerces to string concatenation (`'53'`), while the `-` operator coerces the string `'5'` to a number, producing `2`."
        },
        {
            "question": "What is a Closure in JavaScript?",
            "options": ["A way to close browser windows programmatically", "A function bundled together with references to its surrounding lexical environment", "A syntax error that halts execution", "An HTML close tag `</html>`"],
            "correct": 1,
            "explanation": "A closure gives an inner function access to its outer enclosing function's scope variables, even after the outer function has returned."
        },
        {
            "question": "Which method is used to attach an event listener to a DOM element in modern JavaScript?",
            "options": ["element.attach()", "element.addEventListener('click', handler)", "element.listen('click')", "element.on('click')"],
            "correct": 1,
            "explanation": "`element.addEventListener(eventType, callback)` is the standard W3C method for registering event handlers on DOM nodes."
        },
        {
            "question": "What does the `async/await` syntax in JavaScript provide?",
            "options": ["A way to run code on multiple CPU threads in parallel", "Syntactic sugar over Promises, allowing asynchronous code to be written and read like synchronous code", "A replacement for if-else statements", "A method to compress JavaScript files"],
            "correct": 1,
            "explanation": "`async/await` simplifies working with Promise-based asynchronous calls, eliminating callback nesting and `.then()` chaining."
        }
    ],
    ("web-development", 5): [
        {
            "question": "Which JavaScript array method creates a new array populated with the results of calling a provided function on every element?",
            "options": ["array.forEach()", "array.map()", "array.filter()", "array.reduce()"],
            "correct": 1,
            "explanation": "`map()` transforms every element and returns a new array of the same length, without mutating the original array."
        },
        {
            "question": "What does the spread operator (`...`) do when used on an object in JavaScript?",
            "options": ["Splits the object into multiple files", "Creates a shallow copy or expands object properties into a new object", "Deletes all properties", "Converts the object to an XML string"],
            "correct": 1,
            "explanation": "The spread operator `{ ...oldObj, newProp: 1 }` shallow-copies properties into a new object, facilitating immutable updates."
        },
        {
            "question": "What is the output of `[1, 2, 3, 4].filter(x => x % 2 === 0)`?",
            "options": ["[1, 3]", "[2, 4]", "[true, false, true, false]", "[2]"],
            "correct": 1,
            "explanation": "`filter()` returns elements where the callback returns truthy. `2 % 2 === 0` and `4 % 2 === 0`, producing `[2, 4]`."
        },
        {
            "question": "How do you safely parse a JSON string into a JavaScript object and handle potential formatting syntax errors?",
            "options": ["eval(jsonString)", "Wrap `JSON.parse(jsonString)` inside a `try...catch` block", "JSON.stringify(jsonString)", "Use regex replace"],
            "correct": 1,
            "explanation": "`JSON.parse()` throws a `SyntaxError` on malformed inputs, so production code wraps it in `try...catch` to handle exceptions gracefully."
        },
        {
            "question": "What is the difference between `localStorage` and `sessionStorage` in browser web storage?",
            "options": ["`localStorage` persists across browser sessions and tabs; `sessionStorage` is cleared when the tab/window is closed", "`localStorage` only stores numbers; `sessionStorage` stores text", "`sessionStorage` is sent with every HTTP request; `localStorage` is not", "There is no difference"],
            "correct": 0,
            "explanation": "`localStorage` data remains permanently until explicitly deleted; `sessionStorage` data lives only for the current browser tab session."
        }
    ],
    ("web-development", 6): [
        {
            "question": "What is JSX in React development?",
            "options": ["A new programming language that replaces JavaScript", "A syntax extension for JavaScript that lets you write HTML-like markup inside JavaScript files", "A database query language", "A CSS preprocessor like SASS"],
            "correct": 1,
            "explanation": "JSX stands for JavaScript XML. It allows writing declarative UI markup that compiles down to standard `React.createElement()` calls."
        },
        {
            "question": "Which React hook is used to declare and update local reactive state inside a functional component?",
            "options": ["useEffect", "useState", "useContext", "useRef"],
            "correct": 1,
            "explanation": "`const [state, setState] = useState(initialValue)` declares a state variable and its corresponding updater function."
        },
        {
            "question": "What is the primary purpose of the `useEffect` hook in React?",
            "options": ["To style HTML elements with CSS", "To perform side effects such as data fetching, subscriptions, or manually updating DOM nodes", "To store global passwords", "To replace all JavaScript functions"],
            "correct": 1,
            "explanation": "`useEffect` lets components synchronize with external systems, perform API calls, and clean up subscriptions upon unmounting."
        },
        {
            "question": "Why is a `key` prop required when rendering lists of elements in React?",
            "options": ["To encrypt the list items for security", "To help React's virtual DOM diffing algorithm identify which items have changed, been added, or removed", "To count how many elements are rendered", "It is optional and never recommended"],
            "correct": 1,
            "explanation": "Stable, unique keys allow React to track list item identity across re-renders, preventing expensive full re-mounts and input state bugs."
        },
        {
            "question": "What is the rule regarding updating state variables in React?",
            "options": ["Directly mutate the state object: `state.count = 5`", "Always treat state as immutable and pass a new value or callback to the updater: `setState(5)` or `setState(prev => prev + 1)`", "Never update state more than once per minute", "State can only be updated inside HTML forms"],
            "correct": 1,
            "explanation": "React detects state updates through reference equality checks. Directly mutating state skips re-renders; you must call the setter function."
        }
    ],
    ("web-development", 7): [
        {
            "question": "What is the primary function of React Router in Single Page Applications (SPAs)?",
            "options": ["To connect the app to a Wi-Fi router", "To enable client-side routing, updating the URL and view without requiring full page browser reloads", "To compile JSX into assembly code", "To optimize database queries"],
            "correct": 1,
            "explanation": "React Router intercepts browser navigation events and conditionally renders components based on URL pathnames without reloading the page."
        },
        {
            "question": "What is 'Prop Drilling' in React, and how is it commonly avoided?",
            "options": ["Drilling holes in hardware; avoided with cooling fans", "Passing props down through multiple layers of intermediate components that don't need them; avoided using React Context or state management libraries", "Calling too many useState hooks in one file", "A build tool optimization technique"],
            "correct": 1,
            "explanation": "Prop drilling occurs when data is manually passed through deeply nested trees. Context API (or Zustand/Redux) provides global access without drilling."
        },
        {
            "question": "What happens if you omit the dependency array in a `useEffect` hook: `useEffect(() => { ... })`?",
            "options": ["The effect never runs", "The effect runs once on mount only", "The effect runs after EVERY single component render", "React throws a fatal compilation error"],
            "correct": 2,
            "explanation": "Without a dependency array, the effect executes on initial mount and after every subsequent state/prop re-render, potentially causing infinite loops."
        },
        {
            "question": "Which hook creates a mutable reference that persists across re-renders without triggering a re-render when its `.current` value changes?",
            "options": ["useRef", "useState", "useMemo", "useCallback"],
            "correct": 0,
            "explanation": "`useRef` stores a mutable value in `.current` that persists for the component lifetime, and directly referencing DOM nodes without causing re-renders."
        },
        {
            "question": "Which popular deployment platforms provide zero-configuration static and serverless hosting with automatic Git CI/CD deployments for React apps?",
            "options": ["Vercel and Netlify", "MySQL Workbench", "Docker Desktop only", "Apache Hadoop"],
            "correct": 0,
            "explanation": "Vercel and Netlify integrate directly with GitHub/GitLab, automatically building and distributing React/Next.js/Vite apps on global edge networks."
        }
    ],
    ("web-development", 8): [
        {
            "question": "In modern full-stack web applications, what is Cross-Origin Resource Sharing (CORS)?",
            "options": ["A framework for sharing databases between companies", "A browser security mechanism that restricts HTTP requests initiated from scripts outside the origin domain", "An image compression format", "A tool for sharing CSS stylesheets"],
            "correct": 1,
            "explanation": "CORS prevents unauthorized cross-origin requests unless the backend explicitly responds with headers like `Access-Control-Allow-Origin`."
        },
        {
            "question": "What is the purpose of Environment Variables (e.g. `.env` files) in web development projects?",
            "options": ["To make the code run faster", "To store sensitive credentials (API keys, DB URLs) outside of source control and configure environment-specific settings", "To translate web pages into multiple languages", "To format HTML code automatically"],
            "correct": 1,
            "explanation": "Environment variables keep secrets like API keys and database passwords out of git repositories and allow switching between dev/production configs."
        },
        {
            "question": "What does a `201 Created` HTTP status code represent?",
            "options": ["The request failed due to bad input", "The request succeeded and led to the creation of a new resource", "The requested resource was not found", "The server encountered an unexpected internal error"],
            "correct": 1,
            "explanation": "HTTP 201 Created indicates that a POST request was successful and a new database resource or entity was generated."
        },
        {
            "question": "Which web performance metric measures the time it takes for the largest content element (e.g., hero image, main heading) to become visible in the viewport?",
            "options": ["First Input Delay (FID)", "Largest Contentful Paint (LCP)", "Cumulative Layout Shift (CLS)", "Time to Interactive (TTI)"],
            "correct": 1,
            "explanation": "LCP is a core Google Web Vital measuring perceived loading speed; Google recommends LCP occur within 2.5 seconds of page load."
        },
        {
            "question": "What is the recommended practice for handling API request loading and error states in modern frontend components?",
            "options": ["Show a completely blank white screen until data arrives", "Render dedicated loading skeletons or spinners during fetch, and display user-friendly error banners with retry buttons on failure", "Crash the browser window if an API returns 500", "Silently ignore errors without notifying the user"],
            "correct": 1,
            "explanation": "Professional UIs maintain clear states: loading indicators prevent confusion, and explicit error UI with retry actions guides users."
        }
    ]
}


def main():
    print(f"Connecting to SQLite database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    total_added = 0
    total_cleaned = 0

    for (slug, mod_num), questions in QUIZ_DATA.items():
        # Find module ID
        c.execute("""
            SELECT m.id, m.title
            FROM course_modules m
            JOIN courses c ON c.id = m.course_id
            WHERE c.slug = ? AND m.module_number = ?
        """, (slug, mod_num))
        row = c.fetchone()
        if not row:
            print(f"[-] Module not found: {slug} Mod {mod_num}")
            continue

        mod_id, mod_title = row

        # Check existing questions for this module
        c.execute("SELECT id, question FROM quiz_questions WHERE module_id = ?", (mod_id,))
        existing = c.fetchall()

        # If existing question looks like a generic placeholder, clean it out first
        for q_id, q_text in existing:
            if "primary purpose of" in q_text.lower() or "what technology is" in q_text.lower():
                c.execute("DELETE FROM quiz_questions WHERE id = ?", (q_id,))
                total_cleaned += 1

        # Re-fetch existing question texts
        c.execute("SELECT question FROM quiz_questions WHERE module_id = ?", (mod_id,))
        existing_questions = set(r[0] for r in c.fetchall())

        added_count = 0
        for q in questions:
            if q["question"] in existing_questions:
                continue

            q_id = str(uuid.uuid4())
            now_iso = datetime.now(timezone.utc).isoformat()
            c.execute("""
                INSERT INTO quiz_questions (
                    id, module_id, lesson_id, question, question_type,
                    options_json, correct_answer, explanation, points, created_at
                ) VALUES (?, ?, NULL, ?, 'mcq', ?, ?, ?, 1, ?)
            """, (
                q_id,
                mod_id,
                q["question"],
                json.dumps(q["options"]),
                str(q["correct"]),
                q["explanation"],
                now_iso
            ))
            added_count += 1
            total_added += 1

        print(f"[+] {slug} | Mod {mod_num} ({mod_title}): Added {added_count} questions. Total in module now = {len(existing_questions) + added_count}")

    conn.commit()

    # Verify counts
    print("\n--- FINAL VERIFICATION OF ALL COURSES AND MODULES ---")
    c.execute("""
        SELECT c.slug, m.module_number, count(q.id) as q_count
        FROM courses c
        JOIN course_modules m ON m.course_id = c.id
        LEFT JOIN quiz_questions q ON q.module_id = m.id
        GROUP BY m.id
        ORDER BY c.slug, m.module_number
    """)
    rows = c.fetchall()
    all_five = True
    for slug, m_num, count in rows:
        status = "OK" if count == 5 else f"MISMATCH ({count})"
        if count != 5:
            all_five = False
        print(f"  {slug} | Mod {m_num}: {count} questions [{status}]")

    print(f"\nCompleted! Cleaned: {total_cleaned}, Added: {total_added}. All modules have 5 MCQs: {all_five}")
    conn.close()

if __name__ == '__main__':
    main()
