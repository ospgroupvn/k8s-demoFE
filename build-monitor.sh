#!/bin/bash

# Build Monitor Script
echo "🔍 Monitoring Docker image build progress..."

while true; do
    echo "================================="
    echo "⏰ $(date)"
    echo "================================="
    
    # Check job status
    echo "📊 Job Status:"
    kubectl get jobs -n k8s-demo | grep build || echo "No build jobs found"
    
    # Check pod status  
    echo -e "\n🏃 Pod Status:"
    kubectl get pods -n k8s-demo | grep build || echo "No build pods found"
    
    # Check recent logs
    BUILD_POD=$(kubectl get pods -n k8s-demo --no-headers | grep build | grep Running | awk '{print $1}' | head -1)
    if [ ! -z "$BUILD_POD" ]; then
        echo -e "\n📝 Recent logs from $BUILD_POD:"
        kubectl logs $BUILD_POD -n k8s-demo --tail=5 2>/dev/null || echo "No logs available"
    fi
    
    # Check if build completed
    COMPLETED_JOB=$(kubectl get jobs -n k8s-demo --no-headers | grep build | grep "1/1" | head -1)
    if [ ! -z "$COMPLETED_JOB" ]; then
        echo -e "\n🎉 BUILD COMPLETED!"
        JOB_NAME=$(echo "$COMPLETED_JOB" | awk '{print $1}')
        echo "Job: $JOB_NAME completed successfully"
        
        # Update deployment
        echo -e "\n🚀 Updating deployment..."
        kubectl patch deployment k8s-demo-fe -n k8s-demo -p '{"spec":{"template":{"metadata":{"annotations":{"deploy-time":"'$(date)'"}}}}}'
        
        echo -e "\n📊 Checking deployment status..."
        kubectl get pods -n k8s-demo -l app=k8s-demo-fe
        
        break
    fi
    
    echo -e "\n⏳ Waiting 30 seconds..."
    sleep 30
done

echo -e "\n✅ Build monitoring completed!"
