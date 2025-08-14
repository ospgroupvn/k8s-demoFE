#!/bin/bash

# Script kiểm tra môi trường trước khi triển khai

echo "=== KIỂM TRA MÔI TRƯỜNG TRIỂN KHAI ==="

# Kiểm tra kubectl
echo "1. Kiểm tra kubectl..."
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl chưa được cài đặt"
    exit 1
fi
echo "✅ kubectl: $(kubectl version --client --short)"

# Kiểm tra kết nối cluster
echo "2. Kiểm tra kết nối K8s cluster..."
if ! kubectl get nodes &> /dev/null; then
    echo "❌ Không thể kết nối đến K8s cluster"
    exit 1
fi
echo "✅ Kết nối K8s cluster thành công"

# Kiểm tra namespace
echo "3. Kiểm tra namespace k8s-demo..."
if kubectl get namespace k8s-demo &> /dev/null; then
    echo "✅ Namespace k8s-demo đã tồn tại"
else
    echo "❌ Namespace k8s-demo chưa tồn tại. Tạo namespace:"
    kubectl create namespace k8s-demo
fi

# Kiểm tra Actions Runner Controller
echo "4. Kiểm tra Actions Runner Controller..."
if kubectl get pods -n actions-runner-system | grep -q "Running"; then
    echo "✅ Actions Runner Controller đang chạy"
else
    echo "❌ Actions Runner Controller không chạy hoặc chưa cài đặt"
fi

# Kiểm tra Traefik
echo "5. Kiểm tra Traefik Gateway..."
if kubectl get svc -n default | grep -q "192.168.1.203"; then
    echo "✅ Traefik Gateway với IP 192.168.1.203 đã tồn tại"
else
    echo "⚠️  Cần kiểm tra Traefik Gateway IP 192.168.1.203"
fi

# Kiểm tra Harbor registry connectivity
echo "6. Kiểm tra kết nối Harbor Registry..."
if curl -s -k https://reg.ospgroup.vn/api/v2.0/projects &> /dev/null; then
    echo "✅ Harbor Registry có thể kết nối"
else
    echo "❌ Không thể kết nối đến Harbor Registry"
fi

# Kiểm tra Docker
echo "7. Kiểm tra Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker: $(docker --version)"
else
    echo "⚠️  Docker chưa được cài đặt (cần thiết để build local)"
fi

# Kiểm tra các services hiện có trong namespace
echo "8. Kiểm tra các services hiện có trong k8s-demo..."
echo "Pods:"
kubectl get pods -n k8s-demo
echo "Services:"
kubectl get svc -n k8s-demo
echo "IngressRoutes:"
kubectl get ingressroute -n k8s-demo

echo ""
echo "=== THÔNG TIN CẦN THIẾT ==="
echo "Registry: reg.ospgroup.vn"
echo "Username: robot\$demok8s+robot-k8sdemo"  
echo "Password: SAw5ocSomcuO4PufflvuhSG8P4VTIQoI"
echo "Traefik Gateway: 192.168.1.203"
echo "Nginx Proxy: 192.168.1.47"
echo "Target URL: https://common.ospgroup.vn/bttp/"

echo ""
echo "=== BƯỚC TIẾP THEO ==="
echo "1. Cấu hình GitHub Repository Secrets:"
echo "   - HARBOR_USERNAME: robot\$demok8s+robot-k8sdemo"
echo "   - HARBOR_PASSWORD: SAw5ocSomcuO4PufflvuhSG8P4VTIQoI"
echo ""
echo "2. Chạy script triển khai:"
echo "   chmod +x deploy.sh && ./deploy.sh"
echo ""
echo "3. Kiểm tra GitHub Actions runner:"
echo "   kubectl get runnerdeployment -n k8s-demo"
