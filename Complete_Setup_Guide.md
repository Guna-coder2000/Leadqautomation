# 🚀 Complete Setup & Installation Guide (From Scratch)

Welcome! This guide explains **every single step** required to set up the LeadQ Playwright Automation framework on a brand new computer. It assumes you have absolutely nothing installed.

Follow these steps sequentially to create the necessary accounts, install the software, and run the pipelines.

---

## 💻 Part 1: Install Required Software (Prerequisites)

Before running any automation, you must install the core tools on your computer.

### 1. Install Node.js
> [!NOTE]
> The framework is written in TypeScript/JavaScript, which requires Node.js to execute.
1. Go to [nodejs.org](https://nodejs.org/).
2. Download and install the **LTS (Long Term Support)** version for Windows.
3. Keep clicking "Next" during installation (the default settings are perfect).

### 2. Install Git
> [!NOTE]
> Git allows you to securely download the code from GitHub and push your changes back to the cloud.
1. Go to [git-scm.com/download/win](https://git-scm.com/download/win).
2. Download the **"64-bit Git for Windows Setup"**.
3. Install it using the default settings.

### 3. Install VS Code (Visual Studio Code)
> [!NOTE]
> This is the professional IDE (code editor) you will use to view the code and run local commands.
1. Go to [code.visualstudio.com](https://code.visualstudio.com/).
2. Download and install the Windows version.

### 4. Install Jenkins (For Local CI/CD)
> [!NOTE]
> Jenkins is the automation server that will run your pipelines locally in the background.
1. You must have Java installed first. If you don't, download and install [Java JDK 17](https://adoptium.net/).
2. Go to [jenkins.io/download](https://www.jenkins.io/download/) and download the generic Java package (`jenkins.war`).
3. Save it to a dedicated folder on your computer (for example, `C:\Jenkins`).

---

## 🔐 Part 2: Create Required Accounts & Passwords

To use the cloud pipelines and send HTML email reports, you need specific accounts and security tokens.

### 1. GitHub Account & Personal Access Token (PAT)
> [!IMPORTANT]
> GitHub stores your code in the cloud and runs the cloud pipelines. The PAT is required to securely push code from your VS Code terminal.
1. Go to [github.com](https://github.com/) and create a free account (if you don't have one).
2. Log in, go to the top right corner, click your profile picture, and select **Settings**.
3. Scroll down the left menu and click **Developer settings** -> **Personal access tokens** -> **Tokens (classic)**.
4. Click **Generate new token (classic)**.
5. Name it `LeadQ Automation`.
6. **CRITICAL:** Check the box that says **`repo`** (This gives the token permission to push code).
7. Click Generate, and **copy the long password** (it starts with `ghp_...`). Save this somewhere safe!

### 2. Google App Password (For Emails)
> [!IMPORTANT]
> The framework automatically emails the test results. Google blocked regular passwords for apps, so you must create a special "App Password".
1. Go to [myaccount.google.com](https://myaccount.google.com/) and log in with your Gmail.
2. Go to **Security** on the left menu.
3. Turn on **2-Step Verification** (if it isn't already).
4. Once on, search for **App Passwords** in the Google search bar.
5. Create a new App Password named `Jenkins Automation`.
6. Google will give you a 16-letter password (e.g., `abcd efgh ijkl mnop`). 
7. **Copy it, but remove the spaces when you use it** (e.g., `abcdefghijklmnop`).

---

## ⚙️ Part 3: Project Setup & Configuration

Now that everything is installed, let's configure the actual project.

### 1. Download the Code
Open your VS Code terminal (Terminal -> New Terminal) and clone the repository:
```bash
git clone https://github.com/Guna-coder2000/Leadqautomation.git
cd Leadqautomation
```

### 2. Configure the `.env` Secrets File
> [!WARNING]
> Do not skip this step! The framework cannot send emails or push code without this file.
1. In the `Leadqautomation` folder, you will see a file named `.env.example`.
2. Copy it and rename the copy to exactly **`.env`**.
3. Open `.env` and fill it in:
   - `SMTP_USER`: Your Gmail address.
   - `SMTP_PASS`: Your 16-letter Google App Password (no spaces).
   - `GITHUB_PAT`: Your GitHub Personal Access Token.

### 3. Install the Framework Dependencies
In your VS Code terminal, run these exact commands:
```bash
npm install
npx playwright install --with-deps
```
*This securely downloads Playwright, Allure Reporter, and the Google Chrome browsers required to run the tests.*

---

## 🚀 Part 4: How to Run the Framework

You can now run the framework in 3 different environments!

### Method A: Run Locally in VS Code (For Development)
Runs directly on your computer. A physical Chrome window will pop open so you can see the tests executing.

**NPM Scripts (Shortcuts):**
* To run the tests: 
  ```bash
  npm run test
  ```
* To view the HTML report & send the email: 
  ```bash
  npm run report:allure
  ```

**Raw Playwright Commands (Advanced):**
If you want granular control, you can use the built-in commands directly:
* `npx playwright test` (Runs all tests)
* `npx playwright test --headed` (Runs tests and physically watches the browser)
* `npx playwright test --ui` (Opens the interactive Playwright UI Runner)
* `npx playwright test src/tests/e2e/login.spec.ts` (Runs one specific test file)


### Method B: Run via Local Jenkins Pipeline
Jenkins runs the tests silently in the background and generates a permanent report history.

**Setup:**
1. Open a terminal where you downloaded `jenkins.war` and start it:
   ```bash
   java -jar jenkins.war --enable-future-java
   ```
2. Open your browser to `http://localhost:8080`.
3. Find the initial password located inside `C:\Users\<username>\.jenkins\secrets\initialAdminPassword`.
4. Install the **Allure Plugin** (Manage Jenkins -> Plugins -> Available).
5. Create a new Pipeline job, point it to your GitHub URL, and specify `*/main` as the branch.

**Run:** Click **Build Now** in Jenkins. It will automatically read the `Jenkinsfile` in your code, run the tests, and email you the final report.


### Method C: Run via GitHub Actions (Cloud Pipeline)
Microsoft's cloud servers run your tests automatically every time you push code. You don't even need your computer turned on!

**Setup:**
1. Go to your repository on GitHub.
2. Click **Settings** -> **Secrets and variables** -> **Actions**.
3. Add your `SMTP_USER`, `SMTP_PASS`, and `EMAIL_TO` secrets here so the cloud can securely send emails.

**Run:** 
1. Make a change to your code in VS Code.
2. Push the code: 
   ```bash
   git add -A
   git commit -m "triggering cloud pipeline"
   git push origin main
   ```
3. The pipeline will instantly start running under the **Actions** tab on your GitHub repository!
