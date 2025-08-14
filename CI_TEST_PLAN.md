# CI/CD Test Plan

## Tình trạng hiện tại:
✅ Actions Runner Controller đã setup
✅ Harbor registry đã cấu hình  
✅ Kubernetes manifests đã deploy
🔄 Docker image đang build (pnpm install in progress)

## Bước tiếp theo:

### 1. Hoàn thành Docker Build
```bash
# Theo dõi build progress
kubectl logs -f build-demo-fe-image-v3-2wq9j -n k8s-demo

# Kiểm tra job completion
kubectl get jobs -n k8s-demo
```

### 2. Cấu hình GitHub Secrets
Truy cập: https://github.com/ospgroupvn/k8s-demoFE/settings/secrets/actions

Thêm secrets:
```
HARBOR_USERNAME: robot$demok8s+robot-k8sdemo
HARBOR_PASSWORD: SAw5ocSomcuO4PufflvuhSG8P4VTIQoI
```

### 3. Test CI Pipeline
```bash
# Option 1: Push code change to demo branch
git checkout demo
echo "test" >> README.md
git commit -m "test: trigger CI pipeline"
git push origin demo

# Option 2: Manual trigger
# Go to Actions tab và run workflow manually
```

### 4. Verify Deployment
```bash
# Check deployment pods
kubectl get pods -n k8s-demo -l app=k8s-demo-fe

# Check service
kubectl get svc -n k8s-demo -l app=k8s-demo-fe

# Test endpoint
curl -I https://common.ospgroup.vn/bttp/
```

### 5. Monitor CI/CD Process
```bash
# Watch GitHub Actions
echo "Check: https://github.com/ospgroupvn/k8s-demoFE/actions"

# Watch K8s deployment
kubectl get pods -n k8s-demo -l app=k8s-demo-fe -w

# Check runners
kubectl get pods -n k8s-demo | grep runner
```

## Expected Flow:
1. 🔄 Docker build completes → Image pushed to Harbor
2. 🔄 Deployment pods restart with new image  
3. 🔄 GitHub Actions workflow ready for testing
4. ✅ Full CI/CD pipeline operational

## Next: ArgoCD Integration
Sau khi CI working:
- Setup ArgoCD Application
- Configure GitOps workflow  
- Auto-sync from Git changes
- Multi-environment support
