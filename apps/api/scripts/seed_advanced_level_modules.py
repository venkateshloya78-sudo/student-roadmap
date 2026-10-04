"""
seed_advanced_level_modules.py
Adds Module 3 (Advanced Level) with rich lessons and quizzes to the 7 two-module courses,
and categorizes all modules across all 12 courses into 'beginner', 'intermediate', and 'advanced'.
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

ADVANCED_MODULES = [
    # ─── 1. Git & GitHub ───────────────────────────────────────────────────────
    {
        "course_slug": "git-github",
        "module_number": 3,
        "title": "Advanced Git Workflows, Internals, Rebasing & CI/CD Automation",
        "description": "Master Git internals (.git object store), interactive rebasing, binary bisect debugging, filter-repo, and automated GitHub Actions CI/CD pipelines.",
        "hours": 6.5,
        "level": "advanced",
        "lessons": [
            {
                "number": 1,
                "title": "Git Architecture Internals, Interactive Rebase, Bisect & Cherry-Pick",
                "minutes": 35,
                "content": blocks(
                    heading("Understanding Git Architecture and Objects"),
                    text("Under the hood, Git is a content-addressable key-value store with a VCS interface on top. The .git/objects directory stores 4 core object types: blobs (file contents), trees (directory structures and file modes), commits (pointer to a tree, parent commits, author, timestamp, and message), and annotated tags. Every object is identified by a 40-character SHA-1 or SHA-256 hash."),
                    lst("Blob: Contains raw data of a file snapshot, without file metadata or filename.",
                        "Tree: References blobs and nested sub-trees along with filenames and permissions.",
                        "Commit: Points to the root tree object and zero or more parent commit hashes.",
                        "Tag: A permanent named reference with GPG signature and message pointing to an object."),
                    code("# Inspect git objects under the hood\ngit cat-file -p HEAD\ngit cat-file -t a1b2c3d\ngit ls-tree HEAD^{tree}", "bash", "tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904\nauthor Engineer <eng@team.com> 1700000000 +0000\ncommitter Engineer <eng@team.com> 1700000000 +0000\n\nfeat: production release v2.0"),
                    tip("Use git cat-file -p <hash> to inspect any raw object in your local Git repository without modifying working tree state."),
                    heading("Mastering Interactive Rebase (git rebase -i)"),
                    text("Interactive rebasing allows developers to rewrite commit history before pushing to shared upstream branches. You can squash trivial typo commits, reword unclear commit messages, split massive commits into atomic units, and reorder logical commits."),
                    code("# Rebase the last 4 commits interactively\ngit rebase -i HEAD~4\n\n# Commands inside the editor:\n# pick a1b2c3d feat: add authentication token handler\n# squash b2c3d4e fix: fix jwt expiration typo\n# reword c3d4e5f docs: document oauth endpoints\n# drop d4e5f6g test: temporary debug print statement", "bash", "Successfully rebased and updated refs/heads/feature-auth."),
                    warn("Never rebase commits that have already been pushed to a shared public branch (like main or develop). Rewriting shared history breaks branch tracking for all collaborators."),
                    heading("Binary Bug Hunting with Git Bisect"),
                    text("When a regression bug appears in production, git bisect uses binary search over commit history to locate the exact commit that introduced the failure in O(log N) steps instead of testing hundreds of commits linearly."),
                    code("git bisect start\ngit bisect bad                 # Current commit is broken\ngit bisect good v1.4.0         # Last known working release\n# Git checks out midpoint commit:\npytest tests/test_payment.py   # Run test suite\ngit bisect bad                 # If test fails, or git bisect good if passes\n# Repeat until Git reports:\n# 3f8a91b is the first bad commit\ngit bisect reset               # Return to original branch", "bash", "Bisecting: 6 revisions left to test after this (roughly 3 steps)"),
                    example("Enterprise engineering teams use automated bisect with 'git bisect run pytest' in nightlies to isolate regressions across thousands of daily commits in minutes."),
                    practice("What is the difference between git merge and git rebase?", "Git merge creates a new merge commit combining both histories and preserving commit timestamps. Git rebase replays your commits one by one on top of the target base branch, creating a clean linear history without merge bubbles.")
                )
            },
            {
                "number": 2,
                "title": "Automated CI/CD Pipelines with GitHub Actions & Monorepo Workflows",
                "minutes": 35,
                "content": blocks(
                    heading("Continuous Integration with GitHub Actions"),
                    text("GitHub Actions is a built-in CI/CD engine that triggers automated workflows on repository events (push, pull_request, release, scheduled cron). Workflows are defined in YAML under .github/workflows/ and executed in isolated virtual environments (Ubuntu, macOS, Windows)."),
                    code("# .github/workflows/ci.yml\nname: Enterprise CI Pipeline\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Set up Python\n        uses: actions/setup-python@v5\n        with:\n          python-version: '3.11'\n          cache: 'pip'\n      - run: pip install -r requirements.txt\n      - run: pytest --cov=app tests/\n      - run: flake8 app/ --max-line-length=100", "yaml", "Job completed with status: SUCCESS (0 errors, 48 tests passed)"),
                    tip("Always pin your GitHub action steps to major versions or commit SHAs (e.g., actions/checkout@v4) to prevent breaking changes in upstream third-party actions."),
                    heading("Branch Protection Rules and Status Checks"),
                    text("Production-grade repositories enforce strict branch protections on main: requiring at least 2 approving pull request reviews, enforcing linear history, requiring signed commits, and requiring CI status checks to pass before merging."),
                    warn("Ensure secrets such as API keys and cloud deployment credentials are stored in GitHub Repository Secrets (Settings > Secrets and variables) and never committed into plaintext repo files."),
                    example("GitHub Actions matrix builds allow running automated tests across multiple OS environments and language versions (e.g. Node 18, 20, 22 on Linux and Windows) simultaneously."),
                    practice("What is the role of GitHub Actions artifacts?", "Artifacts allow jobs to persist files (such as compiled binaries, test coverage reports, or build dist folders) after a workflow run finishes, enabling downstream jobs or developers to download them.")
                )
            }
        ],
        "quizzes": [
            ("What type of Git object stores file data without permissions or filename?", ["Blob", "Tree", "Commit", "Tag"], 0, "A Blob (Binary Large Object) stores the pure content bytes of a file. Filenames and permissions are stored in Tree objects."),
            ("Which command is used to combine multiple commits into a single atomic commit?", ["git merge --squash", "git rebase -i (squash command)", "git branch -m", "git cherry-pick"], 1, "git rebase -i allows using the 'squash' or 'fixup' command to meld commits into prior commits."),
            ("How does git bisect isolate the commit that introduced a bug?", ["By scanning commit messages with regex", "By running binary search across the commit graph", "By reverting commits in reverse chronological order", "By diffing staged files against git status"], 1, "Git bisect uses binary search algorithm across commit history, cutting search space in half at each step."),
            ("Where are GitHub Actions workflow configuration files placed in a repository?", [".github/actions/", ".github/workflows/", ".ci/pipelines/", "scripts/actions/"], 1, "GitHub Actions looks specifically for YAML workflow files in the .github/workflows/ directory."),
            ("Why is rebasing a public shared branch strongly discouraged in collaborative projects?", ["It corrupts local git repository caches", "It rewrites commit SHAs, causing divergence and merge conflicts for teammates", "It permanently deletes unstaged files", "It removes git tag references from origin"], 1, "Rebasing creates new commit hashes. When pushed with force, other developers working on the original hashes face severe sync conflicts.")
        ]
    },

    # ─── 2. Cloud Computing ───────────────────────────────────────────────────
    {
        "course_slug": "cloud-computing",
        "module_number": 3,
        "title": "Serverless Architecture, Cloud Security & Kubernetes Orchestration",
        "description": "Architect enterprise cloud systems with AWS Lambda/Cloud Functions, AWS IAM zero-trust security policies, Kubernetes cluster deployments, and multi-region disaster recovery.",
        "hours": 7.0,
        "level": "advanced",
        "lessons": [
            {
                "number": 1,
                "title": "Serverless Computing & Event-Driven Microservices (AWS Lambda, Cloud Functions)",
                "minutes": 35,
                "content": blocks(
                    heading("The Serverless Computing Paradigm"),
                    text("Serverless (Function-as-a-Service / FaaS) enables running backend code without provisioning, managing, or patching physical or virtual servers. The cloud provider dynamically manages compute resource allocation, automatic scaling from zero to tens of thousands of concurrent executions, and charges only for the exact milliseconds the function runs."),
                    lst("Zero Server Management: No OS updates, capacity planning, or daemon maintenance.",
                        "Automatic Elastic Scaling: Instances spin up instantly in response to incoming events.",
                        "Pay-per-Execution: Zero idle costs; billing is measured in execution duration and GB-seconds.",
                        "Event-Driven Integration: Direct triggers from S3 bucket uploads, DynamoDB streams, SQS queues, and API Gateways."),
                    code("import json\nimport boto3\n\ns3_client = boto3.client('s3')\n\ndef lambda_handler(event, context):\n    # Triggered automatically on S3 object creation\n    for record in event['Records']:\n        bucket = record['s3']['bucket']['name']\n        key = record['s3']['object']['key']\n        print(f'Processing uploaded file: {bucket}/{key}')\n        \n    return {\n        'statusCode': 200,\n        'body': json.dumps({'message': 'File processed successfully'})\n    }", "python", "Function logs: START RequestId: 4f1a2b... Duration: 142.3 ms Billed Duration: 143 ms Memory Size: 256 MB"),
                    tip("Mitigate serverless cold starts by keeping function package bundles small, using Provisioned Concurrency for latency-critical APIs, or choosing fast runtime runtimes like Go or Node.js."),
                    warn("Functions must be stateless! Any local filesystem writes (/tmp) or memory variables are ephemeral and will not persist across distinct invocation containers."),
                    example("Streaming platforms like Netflix process media assets with event-driven Lambda pipelines: video uploads trigger parallel transcoding, thumbnail extraction, and subtitle indexing functions."),
                    practice("What is the maximum execution timeout for an AWS Lambda function?", "The maximum execution timeout is 15 minutes (900 seconds). For tasks running longer than 15 minutes, containerized workloads via AWS ECS/EKS or AWS Batch are recommended.")
                )
            },
            {
                "number": 2,
                "title": "Container Orchestration with Kubernetes & Cloud Security Governance",
                "minutes": 35,
                "content": blocks(
                    heading("Container Orchestration with Kubernetes (EKS / GKE / AKS)"),
                    text("While serverless is ideal for event-driven tasks, long-running microservices require container orchestration. Kubernetes (K8s) automates deployment, scaling, health-checking, service discovery, and rolling zero-downtime updates of containerized applications across compute clusters."),
                    code("# kubernetes-deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: payment-api\n  labels:\n    app: payment\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: payment\n  template:\n    metadata:\n      labels:\n        app: payment\n    spec:\n      containers:\n      - name: payment-api\n        image: registry.example.com/payment:v2.4\n        ports:\n        - containerPort: 8080\n        resources:\n          limits:\n            cpu: '500m'\n            memory: '512Mi'", "yaml", "deployment.apps/payment-api created\n3/3 pods running, 0 restarts"),
                    tip("Define resource requests and limits for every Kubernetes container to prevent memory leaks from starving other services on the worker node."),
                    heading("Zero-Trust Cloud Security & Identity and Access Management (IAM)"),
                    text("Cloud security follows the Principle of Least Privilege: users, roles, and automated services must be granted strictly the minimal permissions required to execute their specific job."),
                    warn("Never attach wildcard admin privileges ('Action': '*') to production service roles or user accounts. Use strict resource ARNs and condition blocks (e.g. source IP restrictions)."),
                    example("Enterprise platforms use HashiCorp Vault or AWS Secrets Manager to inject database credentials directly into running containers via environment variables without hardcoded files."),
                    practice("What does a Kubernetes Service object do?", "A Kubernetes Service provides a single, stable IP address and DNS name that load-balances network traffic across a dynamically changing set of underlying Pod replicas.")
                )
            }
        ],
        "quizzes": [
            ("Which billing model describes AWS Lambda and Google Cloud Functions?", ["Fixed monthly per-instance tier", "Pay-per-millisecond of compute and memory consumption", "Annual reserved capacity licensing", "Free tier only"], 1, "Serverless FaaS is billed purely on execution invocation count and duration in milliseconds/GB-seconds."),
            ("What is the maximum execution time limit for an AWS Lambda function?", ["60 seconds", "5 minutes", "15 minutes", "60 minutes"], 2, "AWS Lambda functions can run up to a maximum of 15 minutes (900 seconds) before automatic termination."),
            ("Which Kubernetes component is responsible for maintaining the desired number of Pod replicas?", ["kube-proxy", "Deployment / ReplicaSet controller", "etcd storage", "Container runtime (containerd)"], 1, "The ReplicaSet/Deployment controller continuously monitors the cluster and reconciles actual pod count with desired state."),
            ("What security principle requires granting only the absolute minimum permissions needed for a role?", ["Principle of Open Access", "Principle of Least Privilege", "Separation of Network Protocols", "Zero Boundary Authorization"], 1, "The Principle of Least Privilege mandates giving entities only the specific permissions required to perform their tasks."),
            ("Why must serverless functions be designed as stateless?", ["Because serverless architectures do not support cloud databases", "Because execution instances are destroyed and spun up dynamically on demand", "Because serverless only handles HTTP GET requests", "Because cloud providers restrict multi-threading"], 1, "Container instances running serverless code are ephemeral, spinning up and shutting down based on traffic volume.")
        ]
    },

    # ─── 3. Linux System Administration ───────────────────────────────────────
    {
        "course_slug": "linux-system-administration",
        "module_number": 3,
        "title": "Systemd Services, Advanced Shell Automation, Networking & Kernel Tuning",
        "description": "Administer mission-critical Linux servers: write systemd unit services, automate tasks with bash scripting, configure iptables/UFW firewalls, diagnose network latency, and tune kernel parameters.",
        "hours": 6.5,
        "level": "advanced",
        "lessons": [
            {
                "number": 1,
                "title": "Systemd Architecture, Unit Files, Timers & Process Management",
                "minutes": 35,
                "content": blocks(
                    heading("The Systemd Init System"),
                    text("Systemd is the primary init and service management system for modern Linux distributions (Ubuntu, Debian, RHEL, CentOS, Arch). As PID 1, systemd initializes the user space, handles parallel service startup, manages system daemons, captures structured logging via journald, and replaces legacy cron with systemd timers."),
                    code("# /etc/systemd/system/myapp.service\n[Unit]\nDescription=Production FastAPI Backend\nAfter=network.target postgresql.service\n\n[Service]\nType=simple\nUser=deploy\nWorkingDirectory=/var/www/myapp\nExecStart=/var/www/myapp/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000\nRestart=always\nRestartSec=5s\nEnvironment=ENV=production\n\n[Install]\nWantedBy=multi-user.target", "ini", "systemctl daemon-reload\nsystemctl enable --now myapp.service\nsystemctl status myapp.service"),
                    tip("Always set 'Restart=always' and 'RestartSec=5s' in production service units so crashes are automatically recovered by systemd."),
                    heading("Troubleshooting Daemons with Journalctl"),
                    text("Journalctl provides centralized, structured logging for all system services, kernel events, and boots without having to parse fragmented log files in /var/log/."),
                    code("# View live streaming logs for our service\njournalctl -u myapp.service -f\n\n# View error logs since last system boot\njournalctl -u myapp.service -b -p err --no-pager", "bash", "Oct 04 09:30:12 srv1 uvicorn[4120]: [INFO] Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)"),
                    warn("Remember to run 'sudo systemctl daemon-reload' whenever you create or edit a unit file, otherwise systemd executes stale cached definitions."),
                    example("Systemd Timers (.timer files) provide sub-second precision, dependency tracking, and monotonic scheduling, replacing legacy /etc/crontab on modern enterprise servers."),
                    practice("How do you inspect CPU and memory usage of a systemd service in real-time?", "Run 'systemd-cgtop' to see live cgroup resource utilization, or 'systemctl status <service>' for current memory consumption and active PID tree.")
                )
            },
            {
                "number": 2,
                "title": "Production Bash Scripting, Network Troubleshooting & Kernel sysctl Tuning",
                "minutes": 35,
                "content": blocks(
                    heading("Robust Bash Scripting with Unofficial Strict Mode"),
                    text("Writing production shell scripts requires fail-safe execution flags. By default, Bash continues executing even when sub-commands fail or variables are undeclared, which can lead to catastrophic data loss in production automation."),
                    code("#!/usr/bin/env bash\nset -euo pipefail\nIFS=$'\\n\\t'\n\n# -e: exit immediately on error\n# -u: error on referencing unbound variables\n# -o pipefail: exit code of pipeline reflects rightmost error\n\nBACKUP_DIR=\"/var/backups/db\"\nTIMESTAMP=$(date +%Y%m%d_%H%M%S)\n\nmkdir -p \"$BACKUP_DIR\"\npg_dump -U postgres appdb | gzip > \"$BACKUP_DIR/db_$TIMESTAMP.sql.gz\"\necho \"Backup completed successfully: $BACKUP_DIR/db_$TIMESTAMP.sql.gz\"", "bash", "Backup completed successfully: /var/backups/db/db_20261004_094500.sql.gz"),
                    tip("Always use 'set -euo pipefail' at the top of every automation script to stop silent errors."),
                    heading("Network Diagnostics and Kernel sysctl Tuning"),
                    text("When diagnosing network bottlenecks or dropped packets, Linux admins use ss (modern replacement for netstat), traceroute, tcpdump, and tune kernel parameters in /etc/sysctl.conf."),
                    code("# Check active listening ports and established sockets\nss -tuln\n\n# Tune kernel TCP buffers and file descriptor limits in /etc/sysctl.conf\nsudo sysctl -w net.ipv4.tcp_max_syn_backlog=4096\nsudo sysctl -w fs.file-max=2097152\nsudo sysctl -p", "bash", "net.ipv4.tcp_max_syn_backlog = 4096\nfs.file-max = 2097152"),
                    warn("Never increase kernel limits arbitrarily without profiling memory overhead; excessive buffer sizes can lead to Linux OOM (Out Of Memory) killer terminating critical databases."),
                    example("High-throughput web servers tune net.core.somaxconn from default 128 to 4096 to prevent connection drops during flash traffic spikes."),
                    practice("What does the 'pipefail' option in Bash do?", "Without pipefail, the exit status of a command pipeline (e.g. cmd1 | cmd2) is only the status of cmd2. With pipefail enabled, if cmd1 fails, the entire pipeline returns a failure status code.")
                )
            }
        ],
        "quizzes": [
            ("Which process ID (PID) is assigned to systemd as the Linux init process?", ["PID 0", "PID 1", "PID 100", "PID 1000"], 1, "systemd is the very first user space process started by the Linux kernel and always runs as PID 1."),
            ("What command tells systemd to reload its unit files after modifying a service configuration?", ["systemctl reload-all", "systemctl daemon-reload", "systemctl refresh", "service reload"], 1, "systemctl daemon-reload instructs systemd to rescan configuration files and rebuild the dependency tree."),
            ("What does the 'set -e' directive accomplish in a Bash script?", ["Prints all executed commands to stderr", "Exits the script immediately if any command returns a non-zero status", "Disables environment variable expansion", "Suppresses all terminal output"], 1, "set -e (or set -o errexit) ensures the script terminates immediately when a command errors, preventing cascading failures."),
            ("Which command has replaced the legacy 'netstat' tool for inspecting sockets and listening ports in modern Linux?", ["ss", "ifconfig", "ping", "route"], 0, "ss (Socket Statistics) is the modern, faster replacement for netstat on Linux systems."),
            ("Where are persistent kernel runtime parameters configured in Linux?", ["/etc/fstab", "/etc/sysctl.conf", "/etc/hosts", "/boot/grub/grub.cfg"], 1, "Kernel parameters are configured in /etc/sysctl.conf (and /etc/sysctl.d/) and loaded dynamically via sysctl -p.")
        ]
    },

    # ─── 4. DevOps Engineering ────────────────────────────────────────────────
    {
        "course_slug": "devops-engineering",
        "module_number": 3,
        "title": "Kubernetes Orchestration, Infrastructure as Code & Observability",
        "description": "Implement automated enterprise DevOps: write Terraform modules, deploy Helm charts on Kubernetes, automate Canary deployments, and configure Prometheus & Grafana alerting.",
        "hours": 7.0,
        "level": "advanced",
        "lessons": [
            {
                "number": 1,
                "title": "Infrastructure as Code with Terraform & CloudFormation",
                "minutes": 35,
                "content": blocks(
                    heading("Declarative Infrastructure as Code (IaC)"),
                    text("Infrastructure as Code (IaC) treats infrastructure provisioning with software engineering rigor: version-controlled code, peer review, automated testing, and predictable deployment. Terraform by HashiCorp is the industry standard cloud-agnostic declarative IaC tool, managing state and building dependency graphs across AWS, Azure, and GCP."),
                    code("# main.tf - Declarative VPC and Compute Provisioning\nterraform {\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 5.0\"\n    }\n  }\n}\n\nresource \"aws_vpc\" \"prod_vpc\" {\n  cidr_block           = \"10.0.0.0/16\"\n  enable_dns_hostnames = true\n  tags = {\n    Environment = \"Production\"\n  }\n}\n\nresource \"aws_subnet\" \"public_1\" {\n  vpc_id            = aws_vpc.prod_vpc.id\n  cidr_block        = \"10.0.1.0/24\"\n  availability_zone = \"us-east-1a\"\n}", "hcl", "Plan: 2 to add, 0 to change, 0 to destroy.\nApply complete! Resources: 2 added, 0 changed, 0 destroyed."),
                    tip("Always store Terraform state files in a secure remote backend (such as S3 with DynamoDB state locking or Terraform Cloud) to prevent state file corruption when multiple engineers work simultaneously."),
                    heading("Terraform Lifecycle: Plan, Apply, Destroy"),
                    text("Terraform executes via a 3-stage lifecycle: 'terraform init' installs required providers, 'terraform plan' generates an execution diff against current cloud state, and 'terraform apply' reconciles discrepancies idempotently."),
                    warn("Never run 'terraform apply -auto-approve' in production pipelines without automated plan review or guardrails like Conftest/Checkov checking for security misconfigurations."),
                    example("Enterprises use Terraform workspaces to deploy identical architectural stacks across dev, staging, and production environments with simple variable overrides."),
                    practice("What is the purpose of the Terraform state file (terraform.tfstate)?", "The state file maps real-world cloud resources to your configuration code, tracks resource metadata, and calculates dependency diffs for plan execution.")
                )
            },
            {
                "number": 2,
                "title": "Production Kubernetes Clusters, Helm Charts & Observability with Prometheus/Grafana",
                "minutes": 35,
                "content": blocks(
                    heading("Package Management for Kubernetes with Helm"),
                    text("As applications scale across dozens of microservices, managing raw Kubernetes YAML manifests becomes unmanageable. Helm acts as the package manager for Kubernetes, packaging deployments, services, and ingress rules into versioned, parameterized Helm Charts."),
                    code("# Install and upgrade microservice with Helm\nhelm repo add bitnami https://charts.bitnami.com/bitnami\nhelm install my-release bitnami/redis --set auth.enabled=true,auth.password=secret123\nhelm upgrade my-release bitnami/redis --values production-values.yaml\nhelm status my-release", "bash", "NAME: my-release\nSTATUS: deployed\nREVISION: 2\nTEST SUITE: None"),
                    tip("Use Helm rollback (e.g. 'helm rollback my-release 1') to immediately revert a failed production release back to a previous healthy revision."),
                    heading("The Three Pillars of Observability: Metrics, Logs & Traces"),
                    text("Observability enables engineering teams to understand the internal health of complex distributed systems by analyzing external outputs: Prometheus scrapes time-series metrics, Grafana renders real-time visualization dashboards, and OpenTelemetry captures distributed request traces across microservices."),
                    code("# PromQL: Calculate 99th percentile request latency over 5 minutes\nhistogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))\n\n# Alerting Rule: High 5xx HTTP Error Rate (> 2%)\nsum(rate(http_requests_total{status=~\"5..\"}[5m])) \n/ \nsum(rate(http_requests_total[5m])) * 100 > 2", "promql", "Alert firing: HighHttp5xxErrorRate (Severity: Critical) -> PagerDuty triggered"),
                    warn("Avoid high cardinality metric labels (such as attaching user_id or IP addresses to Prometheus metrics); unbounded unique label combinations will overwhelm Prometheus TSDB memory."),
                    example("Spotify monitors millions of concurrent audio streams using Prometheus metrics aggregated into Grafana panels with PagerDuty automated escalation."),
                    practice("What is the difference between Monitoring and Observability?", "Monitoring tells you when a system is broken (e.g., CPU is at 95% or 500 error alerts). Observability allows you to infer why the system broke and debug novel, unforeseen failure states inside distributed architectures.")
                )
            }
        ],
        "quizzes": [
            ("Which tool is the industry standard cloud-agnostic declarative Infrastructure as Code (IaC) tool?", ["Ansible", "Terraform", "Puppet", "Docker Compose"], 1, "Terraform uses declarative HCL (HashiCorp Configuration Language) to manage cloud infrastructure across multiple providers."),
            ("Why is remote state locking essential when using Terraform in a team environment?", ["To encrypt the local git repository", "To prevent concurrent Terraform runs from corrupting the state file", "To accelerate download speeds of Docker images", "To bypass cloud provider authentication"], 1, "State locking (using tools like AWS DynamoDB) prevents multiple engineers from applying changes at the same time, preventing state corruption."),
            ("What is the primary role of Helm in the Kubernetes ecosystem?", ["Monitoring cluster network packets", "Package management and templating for Kubernetes manifests", "Building container images from source code", "Managing node OS updates"], 1, "Helm is the package manager for Kubernetes, allowing developers to define, version, share, and deploy parameterized applications as Charts."),
            ("What are the Three Pillars of Observability?", ["Compute, Storage, Networking", "Metrics, Logs, Traces", "Deploy, Test, Release", "CI, CD, Monitoring"], 1, "Metrics (numeric time-series data), Logs (discrete timestamped events), and Traces (end-to-end request journeys) constitute the 3 pillars."),
            ("What issue is caused by using high-cardinality labels (like User IDs) in Prometheus metrics?", ["Network bandwidth saturation", "Severe memory bloat and crashing of Prometheus TSDB storage", "Data encryption failure", "Container image size inflation"], 1, "High cardinality creates millions of unique time series streams, rapidly exhausting Prometheus RAM and storage.")
        ]
    },

    # ─── 5. Cybersecurity Fundamentals ───────────────────────────────────────
    {
        "course_slug": "cybersecurity-fundamentals",
        "module_number": 3,
        "title": "Network Security, Penetration Testing & Cryptographic Protocols",
        "description": "Defend and audit modern infrastructures: master public key cryptography (RSA/ECC), TLS handshakes, network packet analysis with Wireshark, penetration testing workflows, and incident response.",
        "hours": 7.0,
        "level": "advanced",
        "lessons": [
            {
                "number": 1,
                "title": "Applied Cryptography, TLS/SSL Handshakes & PKI Architecture",
                "minutes": 35,
                "content": blocks(
                    heading("Symmetric vs. Asymmetric Cryptography"),
                    text("Cryptography is the foundation of digital confidentiality, integrity, and authenticity. Symmetric encryption uses a single shared secret key for both encryption and decryption (AES-256, ChaCha20), providing high throughput. Asymmetric encryption uses mathematically paired public and private keys (RSA, ECC / Curve25519) to securely exchange keys without transmitting the secret."),
                    lst("Confidentiality: Ensuring data cannot be read by unauthorized interceptors.",
                        "Integrity: Verifying data has not been modified in transit using cryptographic hash functions (SHA-256, BLAKE3).",
                        "Authentication: Validating the true identity of communication parties via digital certificates.",
                        "Non-Repudiation: Proving an action was taken by an entity using cryptographic digital signatures."),
                    code("from cryptography.fernet import Fernet\n\n# Symmetric key generation and AES encryption\nkey = Fernet.generate_key()\ncipher_suite = Fernet(key)\n\nplaintext = b'Confidential Employee Salary Record'\nciphertext = cipher_suite.encrypt(plaintext)\nprint('Encrypted:', ciphertext)\n\ndecrypted = cipher_suite.decrypt(ciphertext)\nprint('Decrypted:', decrypted.decode())", "python", "Encrypted: gAAAAABl_2X...89Za\nDecrypted: Confidential Employee Salary Record"),
                    tip("For modern asymmetric cryptography, prefer Elliptic Curve Cryptography (ECC / Ed25519) over RSA: ECC provides equivalent security with much smaller key sizes (256-bit ECC vs 3072-bit RSA) and lower CPU overhead."),
                    heading("The TLS 1.3 Handshake Protocol"),
                    text("Transport Layer Security (TLS 1.3) encrypts HTTPS communications. By eliminating legacy cipher suites and renegotiations, TLS 1.3 reduces the handshake to a single round-trip (1-RTT) while enforcing Perfect Forward Secrecy (PFS), guaranteeing that even if a server's private key is compromised in the future, past recorded sessions cannot be decrypted."),
                    warn("Never roll your own custom cryptographic algorithms or hashing logic! Always use vetted, peer-reviewed libraries such as OpenSSL, libsodium, or language standard crypto packages."),
                    example("Public Key Infrastructure (PKI) underpins the web: Certificate Authorities (CAs) like Let's Encrypt digitally sign domain certificates verified by browser trust stores."),
                    practice("What is Perfect Forward Secrecy (PFS)?", "PFS is a cryptographic property ensuring that session keys generated via ephemeral Diffie-Hellman exchanges are destroyed after each session, so a future leak of the server's long-term private key cannot decrypt historical captured traffic.")
                )
            },
            {
                "number": 2,
                "title": "Ethical Hacking, Penetration Testing Methodologies & Incident Response",
                "minutes": 35,
                "content": blocks(
                    heading("The Ethical Hacking and Penetration Testing Lifecycle"),
                    text("Professional penetration testing is the authorized, systematic simulation of cyberattacks against systems to discover vulnerabilities before malicious threat actors exploit them. Standardized under frameworks like PTES (Penetration Testing Execution Standard) and NIST SP 800-115."),
                    lst("1. Reconnaissance (OSINT): Passive & active information gathering (Shodan, WHOIS, DNS enumeration).",
                        "2. Scanning & Enumeration: Identifying open ports, running services, and versions (Nmap, Nessus).",
                        "3. Vulnerability Analysis: Mapping findings to CVE databases and CVSS severity scores.",
                        "4. Exploitation: Safely verifying exploits without causing system outages.",
                        "5. Post-Exploitation & Reporting: Documenting attack chains, business impact, and remediation steps."),
                    code("# Port scanning and service version detection with Nmap\nnmap -sV -sC -T4 -p 1-1000 192.168.1.10\n\n# Output showing open ports and services\nPORT    STATE SERVICE VERSION\n22/tcp  open  ssh     OpenSSH 8.9p1 Ubuntu\n80/tcp  open  http    nginx 1.18.0\n443/tcp open  ssl/http nginx 1.18.0", "bash", "Nmap done: 1 IP address (1 host up) scanned in 4.32 seconds"),
                    tip("Always obtain an explicit, legally binding Rules of Engagement (RoE) contract before conducting any penetration testing or vulnerability scanning on external systems."),
                    heading("Incident Response: The NIST Framework"),
                    text("When a breach occurs, the Computer Security Incident Response Team (CSIRT) follows a 4-phase cycle: Preparation -> Detection & Analysis -> Containment, Eradication & Recovery -> Post-Incident Activity (Lessons Learned)."),
                    warn("During an active breach, do not reboot affected servers immediately: powering down clears RAM, wiping volatile forensic evidence (like running in-memory malware processes and network socket connections)."),
                    example("Security Operations Centers (SOC) use SIEM tools (like Splunk or Elastic Security) to ingest terabytes of firewall and auth logs daily, correlating alerts to detect lateral movement."),
                    practice("What is the CVSS score scale, and what threshold marks a Critical vulnerability?", "The Common Vulnerability Scoring System (CVSS) rates severity from 0.0 to 10.0. Scores from 9.0 to 10.0 are classified as Critical vulnerabilities requiring urgent patching.")
                )
            }
        ],
        "quizzes": [
            ("Which cryptographic technique uses a single secret key for both encryption and decryption?", ["Asymmetric encryption", "Symmetric encryption", "Hashing", "Digital signatures"], 1, "Symmetric encryption (such as AES) utilizes the same secret key for both encrypting and decrypting data."),
            ("Why is Perfect Forward Secrecy (PFS) crucial in TLS 1.3 communications?", ["It makes passwords unnecessary", "It prevents past captured traffic from being decrypted even if the server private key is leaked later", "It eliminates the need for DNS servers", "It encrypts physical fiber optic cables"], 1, "PFS creates temporary ephemeral keys per session, preventing retroactive decryption of historical traffic."),
            ("What is the first phase of a standardized penetration test?", ["Privilege Escalation", "Reconnaissance / Information Gathering", "Denial of Service", "Lateral Movement"], 1, "Reconnaissance (OSINT and information gathering) is the critical initial stage to map out the target attack surface."),
            ("Why shouldn't an engineer reboot a compromised server during an active cyber incident?", ["It resets the BIOS clock", "It wipes volatile system memory (RAM), destroying crucial forensic evidence", "It permanently deletes hard drive files", "It alerts the ISP automatically"], 1, "Rebooting clears RAM where active malware code, process memory, and open connection sockets reside."),
            ("What CVSS rating score range designates a vulnerability as 'Critical'?", ["4.0 - 6.9", "7.0 - 8.9", "9.0 - 10.0", "10.1 - 15.0"], 2, "CVSS v3.1 rates vulnerabilities between 9.0 and 10.0 as Critical severity.")
        ]
    },

    # ─── 6. Software Engineering ──────────────────────────────────────────────
    {
        "course_slug": "software-engineering",
        "module_number": 3,
        "title": "Distributed Systems Architecture, Microservices & High-Scale Resilience",
        "description": "Design resilient enterprise architectures: master CAP theorem, event-driven messaging with Kafka/RabbitMQ, API Gateways, Circuit Breaker patterns, and high-availability database sharding.",
        "hours": 7.0,
        "level": "advanced",
        "lessons": [
            {
                "number": 1,
                "title": "Microservices Architecture, Event-Driven Messaging (Kafka/RabbitMQ) & API Gateways",
                "minutes": 35,
                "content": blocks(
                    heading("Monoliths vs. Microservices Architecture"),
                    text("Monolithic architectures bundle all domain capabilities into a single unified deployment. While simpler to test and deploy initially, monoliths create coupling bottlenecks as engineering organizations grow. Microservices decompose systems into autonomous, loosely coupled services bounded by business domains (Domain-Driven Design / DDD), allowing independent scaling, technology diversity, and decoupled deployment lifecycles."),
                    lst("Single Responsibility: Each service owns its discrete business domain (Auth, Payment, Catalog).",
                        "Database per Service: Services must never directly query another service's private database.",
                        "API Gateways: Serve as the single entry point handling routing, rate limiting, and auth token verification.",
                        "Asynchronous Messaging: Decoupling services using message brokers instead of blocking HTTP calls."),
                    code("# Asynchronous event publishing with Python and Kafka\nfrom kafka import KafkaProducer\nimport json\n\nproducer = KafkaProducer(\n    bootstrap_servers=['kafka:9092'],\n    value_serializer=lambda v: json.dumps(v).encode('utf-8')\n)\n\norder_event = {\n    'event_type': 'ORDER_PLACED',\n    'order_id': 'ord-98214',\n    'user_id': 'usr-3341',\n    'total_usd': 149.99\n}\n\nproducer.send('order-events', value=order_event)\nproducer.flush()\nprint('Order event successfully published to Kafka topic.')", "python", "Order event successfully published to Kafka topic."),
                    tip("Implement the Outbox Pattern when publishing domain events to prevent distributed inconsistency between database updates and message broker writes."),
                    heading("Understanding the CAP Theorem and PACELC"),
                    text("The CAP theorem proves that in a distributed data store experiencing a network partition (P), the system can guarantee either Consistency (C - every read receives the most recent write) or Availability (A - every non-failing node returns a response), but not both. Modern databases choose between CP (e.g. HBase, MongoDB in strict mode) and AP (e.g. Cassandra, DynamoDB with eventual consistency)."),
                    warn("Avoid synchronous HTTP service chains (e.g. Service A calls B, which calls C, which calls D). Latency compounds multiplicatively, and any downstream failure cascades back through the entire chain."),
                    example("Uber processes millions of ride requests per second using Apache Kafka as an append-only distributed log connecting driver dispatch, routing, and billing microservices."),
                    practice("What is the Database-per-Service pattern, and why is it essential in microservices?", "Database-per-Service mandates that each microservice encapsulates its own private data store, accessible only via API. This prevents hidden schema coupling and allows each service to scale or modify its storage engine independently.")
                )
            },
            {
                "number": 2,
                "title": "High Availability, Circuit Breakers, Caching Strategies & Distributed Consensus",
                "minutes": 35,
                "content": blocks(
                    heading("Resilience Engineering: The Circuit Breaker Pattern"),
                    text("In distributed environments, transient network failures and service slowdowns are inevitable. Without protection, a struggling downstream service causes upstream threads to hang waiting on timeouts, leading to catastrophic cascading failure across the entire cluster. The Circuit Breaker pattern wraps remote calls in a state machine (Closed, Open, Half-Open) to fail fast and shed load."),
                    lst("Closed State: Requests flow normally. Failures are counted against a threshold window.",
                        "Open State: If error rate exceeds the threshold, the circuit trips open immediately; calls fail instantly or return fallback data without touching the failing service.",
                        "Half-Open State: After a cooldown period, a limited test request is allowed through. If it succeeds, the circuit closes; if it fails, the circuit reopens."),
                    code("class CircuitBreaker:\n    def __init__(self, failure_threshold=5, recovery_timeout=30):\n        self.state = 'CLOSED'\n        self.failure_count = 0\n        self.threshold = failure_threshold\n        \n    def call(self, remote_func, fallback_func):\n        if self.state == 'OPEN':\n            return fallback_func() # Fail fast immediately\n        try:\n            res = remote_func()\n            self.failure_count = 0\n            return res\n        except Exception as e:\n            self.failure_count += 1\n            if self.failure_count >= self.threshold:\n                self.state = 'OPEN'\n            return fallback_func()", "python", "Circuit tripped OPEN after 5 consecutive failures. Fallback response served."),
                    tip("Always set explicit, aggressive timeouts (e.g. 1000ms connect, 2000ms read) on all outgoing network calls to avoid blocking backend thread pools indefinitely."),
                    heading("Multi-Tier Caching Strategies (Cache-Aside, Write-Through)"),
                    text("Caching with in-memory stores like Redis drastically reduces database load. The Cache-Aside pattern queries the cache first: on a cache miss, data is read from the primary database, populated into the cache with a Time-To-Live (TTL), and returned."),
                    warn("Beware of Cache Stampede (Thundering Herd): when a popular cache key expires, thousands of concurrent requests hit the database simultaneously. Protect against this with probabilistic early expiration or mutex locks."),
                    example("Twitter uses Redis clusters to cache pre-computed user timelines, serving home feeds in sub-millisecond latencies."),
                    practice("What is the difference between Cache-Aside and Write-Through caching?", "In Cache-Aside, the application code manually coordinates reading from DB and populating cache on misses. In Write-Through, the application writes directly to the cache, and the cache synchronously updates the database before returning.")
                )
            }
        ],
        "quizzes": [
            ("According to the CAP Theorem, what two guarantees can a distributed system choose during a network partition?", ["Consistency OR Availability", "Speed OR Security", "Scalability OR Elasticity", "Reliability OR Observability"], 0, "During a network partition (P), a distributed system must trade off between Consistency (C) and Availability (A)."),
            ("What state does a Circuit Breaker transition to when remote error rates exceed the safety threshold?", ["Closed", "Open", "Half-Open", "Standby"], 1, "The Circuit Breaker transitions to the 'Open' state, immediately rejecting or serving fallback responses to avoid overwhelming downstream services."),
            ("Why is the Database-per-Service pattern strongly recommended in microservice architecture?", ["To eliminate the need for SQL queries", "To ensure tight data coupling across teams", "To prevent services from directly depending on each other's database schemas", "To reduce total storage costs"], 2, "Database-per-Service guarantees loose coupling and autonomy, preventing one service from modifying or depending on internal schemas of another."),
            ("What occurs during a 'Cache Stampede' (Thundering Herd problem)?", ["The cache runs out of hard disk space", "Multiple identical write queries corrupt cache data", "A hot cache key expires and thousands of requests overwhelm the primary database simultaneously", "Network packets are dropped by the firewall"], 2, "When a hot key expires, concurrent incoming queries all detect a miss and storm the database simultaneously to recompute the value."),
            ("Which pattern decouples database writes and event publishing to avoid distributed inconsistency?", ["Outbox Pattern", "Singleton Pattern", "Factory Pattern", "Proxy Pattern"], 0, "The Transactional Outbox pattern writes domain events to an outbox table in the same local DB transaction, ensuring reliable message delivery.")
        ]
    },

    # ─── 7. Mobile App Development ───────────────────────────────────────────
    {
        "course_slug": "mobile-app-development",
        "module_number": 3,
        "title": "Native Device APIs, Offline-First Sync & Production App Store Deployment",
        "description": "Build production-ready cross-platform mobile apps: integrate native hardware APIs (Camera, GPS, Biometrics), implement offline-first database synchronization, and automate App Store & Google Play deployments.",
        "hours": 7.0,
        "level": "advanced",
        "lessons": [
            {
                "number": 1,
                "title": "Hardware APIs, Background Geolocation, Push Notifications & Camera Access",
                "minutes": 35,
                "content": blocks(
                    heading("Accessing Native Hardware Features"),
                    text("Modern cross-platform frameworks (React Native, Flutter) provide bridges to native iOS and Android hardware subsystems. Accessing sensitive hardware capabilities requires requesting runtime user permissions, handling graceful denial states, and complying with Apple App Store and Google Play privacy guidelines."),
                    lst("Camera & Image Picker: Capturing photos, scanning QR/barcodes, and compressing media.",
                        "Geolocation & Geofencing: Foreground GPS tracking and background location services.",
                        "Biometric Authentication: Touch ID, Face ID, and Android BiometricPrompt.",
                        "Push Notifications: APNs (Apple) and FCM (Firebase Cloud Messaging) integration."),
                    code("import * as LocalAuthentication from 'expo-local-authentication';\n\nasync function authenticateWithBiometrics() {\n  const hasHardware = await LocalAuthentication.hasHardwareAsync();\n  const isEnrolled = await LocalAuthentication.isEnrolledAsync();\n  \n  if (!hasHardware || !isEnrolled) {\n    return { success: false, error: 'Biometrics unavailable' };\n  }\n  \n  const result = await LocalAuthentication.authenticateAsync({\n    promptMessage: 'Authenticate to access your secure wallet',\n    fallbackLabel: 'Use PIN passcode'\n  });\n  \n  return result;\n}", "typescript", "BiometricPrompt returned: { success: true }"),
                    tip("Always provide a clear, user-friendly fallback (such as PIN or password entry) when biometric authentication fails or is disabled by the user."),
                    heading("Push Notifications Lifecycle (FCM & APNs)"),
                    text("Push notifications re-engage users even when the app is completely terminated in background memory. Devices register with Apple Push Notification service (APNs) or Firebase Cloud Messaging (FCM) to obtain an ephemeral push token that backend servers use to dispatch targeted notifications."),
                    warn("Never request notification or location permissions immediately on initial app launch! Explain the value proposition to the user in a context-rich onboarding screen before triggering system permission modals."),
                    example("Ride-hailing apps like Lyft use background geolocation services with low-power battery optimization to track driver position and trigger arrival alerts."),
                    practice("Why do iOS and Android require permission strings in Info.plist and AndroidManifest.xml?", "App Store and Play Store security policies require apps to explicitly declare why they access sensitive hardware (like Camera or Location) so users are informed before granting access.")
                )
            },
            {
                "number": 2,
                "title": "Offline-First Data Sync (SQLite/WatermelonDB), CodePush & App Store Release Workflows",
                "minutes": 35,
                "content": blocks(
                    heading("Architecting Offline-First Mobile Applications"),
                    text("Mobile devices regularly experience patchy connectivity, subway dead zones, and airplane mode. An offline-first mobile architecture reads and writes directly to an embedded local database (such as SQLite, WatermelonDB, or Realm). A background sync engine synchronizes local delta changes with remote servers once internet connectivity is restored."),
                    code("// Offline-first synchronization queue pattern\ninterface MutationQueueItem {\n  id: string;\n  endpoint: string;\n  method: 'POST' | 'PUT' | 'DELETE';\n  payload: any;\n  timestamp: number;\n}\n\nasync function processSyncQueue(queue: MutationQueueItem[]) {\n  for (const item of queue) {\n    try {\n      await api.request({ url: item.endpoint, method: item.method, data: item.payload });\n      await localDb.delete('sync_queue', item.id);\n    } catch (err) {\n      if (isNetworkError(err)) break; // Retry on next connection\n      // Log non-network conflict for resolution\n    }\n  }\n}", "typescript", "Synced 14 pending offline mutations successfully with backend API."),
                    tip("Implement optimistic UI updates: immediately reflect user actions in the local UI before server confirmation, rolling back only if a definitive rejection occurs."),
                    heading("Production App Store & Google Play Release Pipelines"),
                    text("Shipping mobile apps to production requires code signing certificates (Apple Provisioning Profiles & Distribution Certificates, Android Keystores), generating App Bundles (.aab) and iOS Archives (.ipa), and automating deployments via tools like Fastlane and EAS (Expo Application Services)."),
                    warn("Keep private keystore files and passwords securely backed up! If an Android production upload keystore is lost, Google Play will reject all future app updates."),
                    example("Leading apps use CodePush / Over-The-Air (OTA) updates to deploy critical JavaScript bug fixes directly to user devices in minutes without waiting days for App Store review."),
                    practice("What is an Android App Bundle (.aab) and why is it preferred over a traditional .apk?", "An .aab allows Google Play's dynamic delivery system to generate optimized, device-specific APKs tailored to each user's specific screen density and CPU architecture, drastically reducing download size.")
                )
            }
        ],
        "quizzes": [
            ("Which database approach provides the smoothest user experience in regions with intermittent mobile connectivity?", ["Online-only GraphQL querying", "Offline-first local database with background synchronization", "Direct WebSocket streaming only", "Browser localStorage"], 1, "Offline-first architectures read and write to local databases immediately and sync changes in the background when connected."),
            ("What tool allows React Native developers to ship instant hotfixes to devices without waiting for App Store review?", ["Docker Hub", "CodePush / OTA Updates", "Kubernetes Helm", "Gradle Daemon"], 1, "CodePush (and Expo OTA updates) allows pushing JavaScript bundle fixes directly to users over-the-air."),
            ("What is the consequence of permanently losing an Android production release Keystore?", ["The app automatically switches to iOS", "You cannot publish any future updates to that existing app on Google Play", "User data on device is instantly wiped", "Google bills an extra penalty fee"], 1, "Google Play relies on the release key signature to authenticate updates. Losing the key prevents publishing new versions under that package ID."),
            ("Why should apps explain value before triggering system permission prompts (like Camera or Location)?", ["Because operating systems reject apps without explanation screens", "To increase user trust and consent rates instead of facing immediate permission denial", "Because system dialogs cannot be dismissed", "To bypass device biometrics"], 1, "Contextual explanations clarify why the feature needs the permission, significantly improving user opt-in rates."),
            ("What file format does Google Play recommend for publishing Android applications to enable dynamic size optimization?", [".zip", ".aab (Android App Bundle)", ".exe", ".iso"], 1, "Android App Bundle (.aab) allows Google Play to generate tailored, minimized APKs for each target device architecture.")
        ]
    }
]

def run():
    print(f"Connecting to {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # 1. Add Module 3 and Lessons + Quizzes for the 7 courses
    for item in ADVANCED_MODULES:
        slug = item["course_slug"]
        course_row = c.execute("SELECT id, num_modules, num_lessons FROM courses WHERE slug = ?", (slug,)).fetchone()
        if not course_row:
            print(f"Course {slug} not found, skipping...")
            continue
        
        cid, num_mods, num_less = course_row

        # Check if Module 3 already exists
        mod_row = c.execute("SELECT id FROM course_modules WHERE course_id = ? AND module_number = ?", (cid, item["module_number"])).fetchone()
        if mod_row:
            print(f"Module {item['module_number']} for {slug} already exists (ID: {mod_row[0]}). Skipping insert.")
            mod_id = mod_row[0]
        else:
            mod_id = str(uuid.uuid4())
            now_iso = datetime.now(timezone.utc).isoformat()
            c.execute("""
                INSERT INTO course_modules (id, course_id, module_number, title, description, estimated_hours, created_at, level)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (mod_id, cid, item["module_number"], item["title"], item["description"], item["hours"], now_iso, item["level"]))
            print(f"Inserted Module {item['module_number']} for {slug}")

        # Insert lessons for Module 3
        for l in item["lessons"]:
            existing_lesson = c.execute("SELECT id FROM lessons WHERE module_id = ? AND lesson_number = ?", (mod_id, l["number"])).fetchone()
            if existing_lesson:
                print(f"  Lesson {l['number']} already exists for {slug} M{item['module_number']}.")
            else:
                les_id = str(uuid.uuid4())
                now_iso = datetime.now(timezone.utc).isoformat()
                c.execute("""
                    INSERT INTO lessons (id, module_id, course_id, lesson_number, title, content_blocks_json, estimated_minutes, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (les_id, mod_id, cid, l["number"], l["title"], l["content"], l["minutes"], now_iso))
                print(f"  Inserted Lesson {l['number']}: {l['title']}")

        # Insert quizzes for Module 3
        for q_text, opts, correct_idx, expl in item["quizzes"]:
            existing_q = c.execute("SELECT id FROM quiz_questions WHERE module_id = ? AND question = ?", (mod_id, q_text)).fetchone()
            if not existing_q:
                q_id = str(uuid.uuid4())
                now_iso = datetime.now(timezone.utc).isoformat()
                c.execute("""
                    INSERT INTO quiz_questions (id, module_id, lesson_id, question, question_type, options_json, correct_answer, explanation, points, created_at)
                    VALUES (?, ?, NULL, ?, 'mcq', ?, ?, ?, 10, ?)
                """, (q_id, mod_id, q_text, json.dumps(opts), opts[correct_idx], expl, now_iso))

    conn.commit()
    print("Module 3 data seeded.")

    # 2. Update level for all modules across all courses
    LEVEL_MAPPINGS = {
        # 8-module courses
        "python-programming": {1: "beginner", 2: "beginner", 3: "beginner", 4: "intermediate", 5: "intermediate", 6: "advanced", 7: "advanced", 8: "advanced"},
        "web-development": {1: "beginner", 2: "beginner", 3: "beginner", 4: "intermediate", 5: "intermediate", 6: "advanced", 7: "advanced", 8: "advanced"},
        
        # 6-module courses
        "sql-fundamentals": {1: "beginner", 2: "beginner", 3: "intermediate", 4: "intermediate", 5: "advanced", 6: "advanced"},
        
        # 5-module courses
        "data-analytics": {1: "beginner", 2: "beginner", 3: "intermediate", 4: "intermediate", 5: "advanced"},
        
        # 3-module courses (DSA and the 7 newly expanded courses)
        "data-structures-algorithms": {1: "beginner", 2: "intermediate", 3: "advanced"},
        "cloud-computing": {1: "beginner", 2: "intermediate", 3: "advanced"},
        "cybersecurity-fundamentals": {1: "beginner", 2: "intermediate", 3: "advanced"},
        "devops-engineering": {1: "beginner", 2: "intermediate", 3: "advanced"},
        "git-github": {1: "beginner", 2: "intermediate", 3: "advanced"},
        "linux-system-administration": {1: "beginner", 2: "intermediate", 3: "advanced"},
        "mobile-app-development": {1: "beginner", 2: "intermediate", 3: "advanced"},
        "software-engineering": {1: "beginner", 2: "intermediate", 3: "advanced"},
    }

    print("Updating module levels and course totals...")
    for slug, mapping in LEVEL_MAPPINGS.items():
        course_row = c.execute("SELECT id FROM courses WHERE slug = ?", (slug,)).fetchone()
        if not course_row:
            continue
        cid = course_row[0]
        for mod_num, lvl in mapping.items():
            c.execute("UPDATE course_modules SET level = ? WHERE course_id = ? AND module_number = ?", (lvl, cid, mod_num))
        
        # Update course num_modules and num_lessons counts
        actual_mods = c.execute("SELECT COUNT(*) FROM course_modules WHERE course_id = ?", (cid,)).fetchone()[0]
        actual_lessons = c.execute("SELECT COUNT(*) FROM lessons WHERE course_id = ?", (cid,)).fetchone()[0]
        c.execute("UPDATE courses SET num_modules = ?, num_lessons = ? WHERE id = ?", (actual_mods, actual_lessons, cid))
        print(f"Updated {slug}: {actual_mods} modules, {actual_lessons} lessons.")

    conn.commit()
    conn.close()
    print("Done! All modules mapped to beginner, intermediate, and advanced.")

if __name__ == '__main__':
    run()
