# application
The project is managed as a monorepo with the following structure:
```
.
├── backend
│   ├── ...
├── frontend
│   ├── ...
├── compose.yaml
├── kubernetes.yaml
├── package.json
└── README.md
```
## Requirements
Because there are multiple ways for running the project on your machine, requirements may change between options:
### Development
Make sure you have [pnpm](https://pnpm.io/), [Node.js](https://nodejs.org/en) and [Python](https://www.python.org/downloads/) installed and working on your system.
### With Docker Compose
Make sure you have either [Docker Desktop](https://docs.docker.com/get-docker) (which includes Docker Compose as part of the installation) or both [Docker Engine](https://docs.docker.com/engine/) and [Docker Compose](https://docs.docker.com/compose/) installed and working on your system. Allowing Docker to be managed as a non-root user may also be necessary depending on how you installed it. See [here](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).
### With Kind and Kubernetes
Make sure you have [Kubernetes](https://kubernetes.io/releases/download/) (`kubectl` is required), [kind](https://kind.sigs.k8s.io/) and either [Docker Engine](https://docs.docker.com/engine/) or [Docker Desktop](https://docs.docker.com/get-docker) installed and working on your system. Allowing Docker to be managed as a non-root user may also be necessary depending on how you installed it. See [here](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).
## How to run
There are multiple ways for running the project on your machine:
### Development
From the root directory, create and activate a virtual environment inside the backend application:
```bash
cd backend && python3 -m venv .venv && source .venv/bin/activate
```
From the root directory, install backend dependencies:
```bash
cd backend && pip install -r requirements.txt
```
If needed, deactivate the virtual environment:
```bash
deactivate
```
From the root directory, install frontend dependencies:
```bash
cd frontend && pnpm install
```
From the root directory, run the entire project:
```bash
pnpm dev
```
You can access the application at `localhost:3000` inside your preferred browser.
### With Docker Compose
From the root directory, simply build and run the entire project:
```bash
docker compose up
```
You can now access the application at `localhost:3000` inside your preferred browser.
### With Kind and Kubernetes
First, create an empty `kind` cluster on your machine:
```bash
kind create cluster
```
Verify the cluster is running successfully:
```bash
kubectl cluster-info --context kind-kind
```
Then, from the root directory, build both applications:
```bash
docker build -t frontend ./frontend
docker build -t backend ./backend
```
Then, load both application images inside the cluster:
```bash
kind load docker-image frontend
kind load docker-image backend
```
Now, from the root directory, apply the provided cluster configuration:
```bash
kubectl apply -f kubernetes.yaml
```
Finally, create a port-forwarding rule to access the cluster externally:
```bash
kubectl port-forward service/frontend 3000:3000
```
You can access the application at `localhost:3000` inside your preferred browser.
