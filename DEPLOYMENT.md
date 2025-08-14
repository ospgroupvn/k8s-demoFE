# K8s Demo Frontend - CI/CD Deployment

## Tổng quan

Phương án triển khai CI/CD sử dụng Actions Runner Controller cho ứng dụng Node.js Next.js trên Kubernetes cluster.

## Kiến trúc

```
Internet → Nginx (192.168.1.47:80/443) → Traefik Gateway (192.168.1.203) → K8s Service → Pod
```

- **Domain**: https://common.ospgroup.vn/bttp/
- **Registry**: reg.ospgroup.vn
- **Namespace**: k8s-demo

## Yêu cầu môi trường

- ✅ Kubernetes cluster với Traefik Gateway
- ✅ Actions Runner Controller đã cài đặt  
- ✅ Harbor Registry: reg.ospgroup.vn
- ✅ Namespace k8s-demo
- ❌ GitHub Repository Secrets cần cấu hình

## Triển khai

### Bước 1: Kiểm tra môi trường
```bash
chmod +x check-env.sh
./check-env.sh
```

### Bước 2: Cấu hình GitHub Secrets
Truy cập: `https://github.com/ospgroupvn/k8s-demoFE/settings/secrets/actions`

Thêm các secrets sau:
- `HARBOR_USERNAME`: `robot$demok8s+robot-k8sdemo`
- `HARBOR_PASSWORD`: `SAw5ocSomcuO4PufflvuhSG8P4VTIQoI`

### Bước 3: Triển khai ban đầu
```bash
chmod +x deploy.sh
./deploy.sh
```

### Bước 4: Kiểm tra runner
```bash
kubectl get runnerdeployment -n k8s-demo
kubectl get pods -n k8s-demo -l app=k8s-demo-fe
```

## Cấu trúc Files

```
.
├── .github/workflows/
│   └── ci-cd.yaml              # GitHub Actions workflow
├── k8s/
│   ├── deployment.yaml         # Kubernetes Deployment
│   ├── service.yaml           # Kubernetes Service  
│   ├── ingressroute.yaml      # Traefik IngressRoute
│   ├── secrets.yaml           # Application Secrets
│   ├── runner-deployment.yaml # Actions Runner
│   └── rbac.yaml             # RBAC cho runner
├── Dockerfile                 # Multi-stage Docker build
├── deploy.sh                 # Script triển khai
└── check-env.sh             # Script kiểm tra môi trường
```

## Workflow CI/CD

1. **Trigger**: Push/PR đến nhánh `demo` hoặc `main`
2. **Build**: Docker build với cache
3. **Push**: Push image đến Harbor Registry
4. **Deploy**: Update deployment trên K8s
5. **Verify**: Kiểm tra trạng thái triển khai

## Monitoring

### Kiểm tra pods
```bash
kubectl get pods -n k8s-demo -l app=k8s-demo-fe
kubectl describe pod <pod-name> -n k8s-demo
```

### Kiểm tra logs  
```bash
kubectl logs -f deployment/k8s-demo-fe -n k8s-demo
```

### Kiểm tra service
```bash
kubectl get svc -n k8s-demo
kubectl get ingressroute -n k8s-demo
```

## Troubleshooting

### 1. Pod không start được
```bash
kubectl describe pod <pod-name> -n k8s-demo
kubectl logs <pod-name> -n k8s-demo
```

### 2. Image pull lỗi
- Kiểm tra Harbor secret: `kubectl get secret harbor-secret -n k8s-demo -o yaml`
- Test registry login: `docker login reg.ospgroup.vn`

### 3. Ingress không hoạt động
- Kiểm tra Traefik: `kubectl get pods -n default | grep traefik`
- Kiểm tra IngressRoute: `kubectl describe ingressroute k8s-demo-fe-ingress -n k8s-demo`

### 4. Runner không connect
```bash
kubectl get runnerdeployment -n k8s-demo
kubectl logs -l app=actions-runner -n k8s-demo
```

## URLs và Endpoints

- **Application**: https://common.ospgroup.vn/bttp/
- **Harbor Registry**: https://reg.ospgroup.vn
- **GitHub Repository**: https://github.com/ospgroupvn/k8s-demoFE

## Tài nguyên

- **CPU Request/Limit**: 250m/500m per pod
- **Memory Request/Limit**: 256Mi/512Mi per pod  
- **Replicas**: 2 pods
- **Runner Resources**: 1-2 CPU, 2-4Gi RAM
