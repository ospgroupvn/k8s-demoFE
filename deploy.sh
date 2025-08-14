#!/bin/bash

# Script triển khai ban đầu cho k8s-demo-fe

echo "=== Bắt đầu triển khai k8s-demo-fe ==="

# 1. Tạo Harbor registry secret
echo "1. Tạo Harbor registry secret..."
kubectl create secret docker-registry harbor-secret \
  --docker-server=reg.ospgroup.vn \
  --docker-username='robot$demok8s+robot-k8sdemo' \
  --docker-password='SAw5ocSomcuO4PufflvuhSG8P4VTIQoI' \
  --namespace=k8s-demo \
  --dry-run=client -o yaml | kubectl apply -f -

# 2. Tạo TLS secret cho common.ospgroup.vn (nếu chưa có)
echo "2. Kiểm tra TLS secret..."
if ! kubectl get secret common-ospgroup-vn-tls -n k8s-demo &> /dev/null; then
    echo "Tạo TLS secret tạm thời (cần cập nhật cert thật sau)"
    kubectl create secret tls common-ospgroup-vn-tls \
      --cert=/dev/null \
      --key=/dev/null \
      --namespace=k8s-demo \
      --dry-run=client -o yaml | kubectl apply -f -
else
    echo "TLS secret đã tồn tại"
fi

# 3. Apply RBAC
echo "3. Apply RBAC..."
kubectl apply -f k8s/rbac.yaml

# 4. Apply secrets
echo "4. Apply application secrets..."
kubectl apply -f k8s/secrets.yaml

# 5. Apply Runner Deployment
echo "5. Apply Runner Deployment..."
kubectl apply -f k8s/runner-deployment.yaml

# 6. Apply Kubernetes manifests
echo "6. Apply Kubernetes manifests..."
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingressroute.yaml

# 7. Kiểm tra trạng thái
echo "7. Kiểm tra trạng thái triển khai..."
echo "Pods:"
kubectl get pods -n k8s-demo -l app=k8s-demo-fe

echo "Services:"
kubectl get svc -n k8s-demo -l app=k8s-demo-fe

echo "IngressRoutes:"
kubectl get ingressroute -n k8s-demo

echo "Runners:"
kubectl get runnerdeployment -n k8s-demo

echo "=== Hoàn thành triển khai ==="
echo "URL: https://common.ospgroup.vn/bttp/"
