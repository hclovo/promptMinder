docker build --no-cache -t promptminder:latest .

docker run -d -p 3000:3000 \
    -e POSTGRES_URL=postgres://postgres:eintCAD5h46n4p@60.204.131.118:5432/promptMinder \
    -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c291bmQtYXBlLTIuY2xlcmsuYWNjb3VudHMuZGV2JA \
    -e CLERK_SECRET_KEY=sk_test_po21qnrqFSRsuKYPPPUyfXxJpVMwo6gHeZaEozpEOq \
    --name promptminder \
    promptminder:latest