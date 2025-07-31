docker build --no-cache -t promptminder:latest .

docker run -d -p 3000:3000 \
    -e POSTGRES_URL=postgres://postgres:eintCAD5h46n4p@60.204.131.118:5432/promptMinder \
    --name promptminder \
    promptminder:latest \
    npm run dev