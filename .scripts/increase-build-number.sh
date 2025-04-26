# Get value for versionCode in package.json
VERSION_CODE=$(node -p "require('./package.json').versionCode")

#Get value for version in parameters
NEW_VERSION=$1
OLD_VERSION=$2

echo $OLD_VERSION
echo $NEW_VERSION

# Increment version code
NEW_VERSION_CODE=$((VERSION_CODE+1))

# Find and replace versionCode for NEW_VERSION_CODE in package.json, build.gradle, and AndroidManifest.xml, Info.plist, project.pbxproj
sed -i '' "s/$VERSION_CODE,/$NEW_VERSION_CODE,/g" package.json
sed -i '' "s/versionCode $VERSION_CODE/versionCode $NEW_VERSION_CODE/g" android/app/build.gradle
sed -i '' "s/\\<string\\>$VERSION_CODE\\<\\/string\\>/\\<string\\>$NEW_VERSION_CODE\\<\\/string\\>/g" ios/**/Info.plist
sed -i '' "s/CURRENT_PROJECT_VERSION = $VERSION_CODE;/CURRENT_PROJECT_VERSION = $NEW_VERSION_CODE;/g" ios/SharedAccount.xcodeproj/project.pbxproj


# Find OLD_VERSION in build.gradle and replace with NEW_VERSION
sed -i '' "s/versionName \\'$OLD_VERSION\\'/versionName \\'$NEW_VERSION\\'/g" android/app/build.gradle

#Find OLD_VERSION In project.pbxproj and replace with NEW_VERSION 
sed -i '' "s/MARKETING_VERSION = $OLD_VERSION/MARKETING_VERSION = $NEW_VERSION/g" ios/SharedAccount.xcodeproj/project.pbxproj
