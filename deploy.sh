echo "Switching to branch master"
git checkout master

echo "Buuilding app.."
npm run build

echo "Deploying files to server..."
scp -r build/* root@165.232.79.109:/var/www/165.232.79.109/

echo "Done!"