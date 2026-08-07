const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'allure-report', 'history');
const destDir = path.join(__dirname, '..', 'allure-results', 'history');

try {
  if (fs.existsSync(srcDir)) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    const files = fs.readdirSync(srcDir);
    for (const file of files) {
      fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    }
    console.log('✅ Allure history preserved successfully. Trend graphs will be populated.');
  } else {
    console.log('ℹ️ No previous Allure history found. This is normal for the first run.');
  }

  // Generate executor.json to populate the Executors widget in Allure
  // Automatically detects CI/CD Pipeline environments
  let executorContent;

  if (process.env.GITHUB_ACTIONS) {
    executorContent = {
      name: "GitHub Actions",
      type: "github",
      reportName: "LeadQ Playwright Automation Report",
      url: `https://github.com/${process.env.GITHUB_REPOSITORY}`,
      buildOrder: parseInt(process.env.GITHUB_RUN_NUMBER) || 1,
      buildName: `Run-${process.env.GITHUB_RUN_NUMBER || new Date().getTime()}`,
      buildUrl: `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    };
  } else if (process.env.JENKINS_URL) {
    executorContent = {
      name: "Jenkins CI",
      type: "jenkins",
      reportName: "LeadQ Playwright Automation Report",
      url: process.env.JENKINS_URL,
      buildOrder: parseInt(process.env.BUILD_NUMBER) || 1,
      buildName: process.env.BUILD_DISPLAY_NAME || `Build-${process.env.BUILD_NUMBER}`,
      buildUrl: process.env.BUILD_URL || process.env.JENKINS_URL
    };
  } else if (process.env.GITLAB_CI) {
    executorContent = {
      name: "GitLab CI",
      type: "gitlab",
      reportName: "LeadQ Playwright Automation Report",
      url: process.env.CI_PROJECT_URL,
      buildOrder: parseInt(process.env.CI_PIPELINE_IID) || 1,
      buildName: `Pipeline-${process.env.CI_PIPELINE_IID}`,
      buildUrl: process.env.CI_PIPELINE_URL
    };
  } else {
    executorContent = {
      name: "Local Execution",
      type: "local",
      reportName: "LeadQ Playwright Automation Report",
      url: "http://localhost",
      buildOrder: 1,
      buildName: `Local-${new Date().getTime()}`,
      buildUrl: "http://localhost"
    };
  }
  
  const resultsDir = path.join(__dirname, '..', 'allure-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  fs.writeFileSync(path.join(resultsDir, 'executor.json'), JSON.stringify(executorContent, null, 2));
  console.log('✅ Executor info generated successfully. Executors widget will be populated.');

} catch (error) {
  console.error('❌ Failed to prepare Allure report data:', error.message);
}
