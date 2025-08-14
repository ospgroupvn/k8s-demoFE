# GitHub Repository Setup cho CI/CD

## 1. Thêm Repository Secrets

Truy cập: https://github.com/ospgroupvn/k8s-demoFE/settings/secrets/actions

Thêm các secrets sau:

```
HARBOR_USERNAME: robot$demok8s+robot-k8sdemo
HARBOR_PASSWORD: SAw5ocSomcuO4PufflvuhSG8P4VTIQoI
```

## 2. Kiểm tra Actions Runner

- Truy cập: https://github.com/ospgroupvn/k8s-demoFE/settings/actions/runners
- Verify có runner `k8s-demo` online

## 3. Test CI Pipeline

Sau khi push code, kiểm tra:
- https://github.com/ospgroupvn/k8s-demoFE/actions

## 4. Kiểm tra Harbor Registry

Sau khi build thành công:
- https://reg.ospgroup.vn
- Project: demok8s  
- Repository: demo-fe

## 5. Test Deployment  

```bash
# Kiểm tra pods
kubectl get pods -n k8s-demo -l app=k8s-demo-fe

# Kiểm tra logs
kubectl logs -l app=k8s-demo-fe -n k8s-demo

# Test truy cập
curl -k https://common.ospgroup.vn/bttp/
```

## 6. Architecture Flow

```
Developer Push → GitHub → Actions Runner (K8s) → Build (Kaniko) → Harbor → Deploy → Traefik → Internet
```
