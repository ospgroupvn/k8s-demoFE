#!/bin/bash

# Script monitor trạng thái triển khai

echo "=== MONITOR TRẠNG THÁI TRIỂN KHAI ==="

echo "1. Trạng thái Build Job:"
kubectl get jobs -n k8s-demo
echo ""

echo "2. Logs Build Process:"
BUILD_POD=$(kubectl get pods -n k8s-demo | grep build | awk '{print $1}')
if [ ! -z "$BUILD_POD" ]; then
    echo "Build pod: $BUILD_POD"
    kubectl get pod $BUILD_POD -n k8s-demo
    echo ""
    echo "Recent build logs:"
    kubectl logs $BUILD_POD -n k8s-demo --tail=20
else
    echo "Không tìm thấy build pod"
fi
echo ""

echo "3. Trạng thái Application Deployment:"
kubectl get deployment -n k8s-demo
echo ""

echo "4. Trạng thái Pods:"
kubectl get pods -n k8s-demo -l app=k8s-demo-fe
echo ""

echo "5. Trạng thái Services:"
kubectl get svc -n k8s-demo -l app=k8s-demo-fe
echo ""

echo "6. Trạng thái IngressRoute:"
kubectl get ingressroute -n k8s-demo
echo ""

echo "7. Trạng thái Runners:"
kubectl get runnerdeployment -n k8s-demo
echo ""

echo "8. Events gần đây:"
kubectl get events -n k8s-demo --sort-by='.lastTimestamp' | tail -10
