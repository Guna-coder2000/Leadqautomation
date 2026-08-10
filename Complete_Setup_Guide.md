# Complete Setup & Installation Guide (From Scratch)

This guide explains **every single step** required to set up this framework on a brand new computer. It assumes you have nothing installed and explains how to create the necessary accounts, install the software, and run the pipelines.

---

## Part 1: Install Required Software (Prerequisites)

Before running any automation, you must install the core tools on your computer.

### 1. Install Node.js
* **Why:** The framework is written in TypeScript/JavaScript, which requires Node.js to execute.
* **How:** 
  1. Go to [nodejs.org](https://nodejs.org/).
  2. Download and install the **LTS (Long Term Support)** version for Windows.
  3. Keep clicking "Next" during installation (default settings are fine).

### 2. Install Git
* **Why:** Git allows you to download the code from GitHub and push your changes back to the cloud.
* **How:**
  1. Go to [git-scm.com/download/win](https://git-scm.com/download/win).
  2. Download the "64-bit Git for Windows Setup".
  3. Install it using the default settings.

### 3. Install VS Code (Visual Studio Code)
* **Why:** This is the editor you will use to view the code and run local commands.
* **How:**
  1. Go to [code.visualstudio.com](https://code.visualstudio.com/).
  2. Download and install for Windows.

### 4. Install Jenkins (For Local CI/CD)
* **Why:** Jenkins is the automation server that will run your pipelines locally.
* **How:**
  1. You must have Java installed. If not, download and install [Java JDK 17](https://adoptium.net/).
  2. Go to [jenkins.io/download](https://www.jenkins.io/download/) and download the generic Java package (`jenkins.war`).
  3. Save it to a folder on your computer (e.g., `C:\Jenkins`).

---

## Part 2: Create Required Accounts & Passwords

To use the cloud pipelines and send emails, you need specific accounts and security tokens.

### 1. GitHub Account & Personal Access Token (PAT)
* **Why:** GitHub stores your code in the cloud and runs the GitHub Actions pipeline. The PAT is required to securely push code from your terminal.
* **How to create it:**
  1. Go to [github.com](https://github.com/) and create a free account (if you don't have one).
  2. Log in, go to the top right corner, click your profile picture, and select **Settings**.
  3. Scroll down the left menu and click **Developer settings** -> **Personal access tokens** -> **Tokens (classic)**.
  4. Click **Generate new token (classic)**.
  5. Name it "LeadQ Automation".
  6. **CRITICAL:** Check the box that says **`repo`** (This gives it permission to push code).
  7. Click Generate, and **copy the long password (`ghp_...`)**. Save this somewhere safe.

### 2. Google App Password (For Emails)
* **Why:** The framework automatically emails the test results. Google blocked regular passwords for apps, so you need a special "App Password".
* **How to create it:**
  1. Go to [myaccount.google.com](https://myaccount.google.com/) and log in with your Gmail.
  2. Go to **Security** on the left menu.
  3. Turn on **2-Step Verification** (if it isn't already).
  4. Once on, search for **App Passwords** in the Google search bar.
  5. Create a new App Password named "Jenkins Automation".
  6. Google will give you a 16-letter password (e.g., `abcd efgh ijkl mnop`). 
  7. **Copy it, but remove the spaces when you use it** (e.g., `abcdefghijklmnop`).

---

## Part 3: Project Setup & Configuration

Now that everything is installed, let's configure the actual project.

### 1. Download the Code
1. Open your VS Code terminal and clone the repository:
   ```bash
   git clone https://github.com/Guna-coder2000/Leadqautomation.git
   cd Leadqautomation
   ```

### 2. Configure the `.env` Secrets File
1. In the `Leadqautomation` folder, you will see a file named `.env.example`.
2. Copy it and rename the copy to exactly **`.env`**.
3. Open `.env` and fill it in:
   - `SMTP_USER`: Your Gmail address.
   - `SMTP_PASS`: Your 16-letter Google App Password (no spaces).
   - `GITHUB_PAT`: Your GitHub Personal Access Token.

### 3. Install the Framework Dependencies
In the VS Code terminal, run:
```bash
npm install
npx playwright install --with-deps
```
*This downloads Playwright, Allure, and the Chrome browsers required to run the tests.*

---

## Part 4: How to Run the Framework

You can now run the framework in 3 different ways.

### Method A: Run Locally in VS Code (For Development)
* **How it works:** Runs directly on your computer. A physical Chrome window will open so you can see the tests executing.
* **Commands:**
  1. To run the tests: `npm run test`
  2. To view the HTML report & send the email: `npm run report:allure`

### Method B: Run via Local Jenkins Pipeline
* **How it works:** Jenkins runs the tests silently in the background and generates a permanent report history.
* **Setup:**
  1. Open a terminal where you downloaded `jenkins.war` and run: `java -jar jenkins.war --enable-future-java`
  2. Open your browser to `http://localhost:8080`.
  3. Find the initial password in `C:\Users\<username>\.jenkins\secrets\initialAdminPassword`.
  4. Install the **Allure Plugin** (Manage Jenkins -> Plugins).
  5. Create a new Pipeline job, point it to your GitHub URL, and specify `*/main` as the branch.
* **Run:** Click **Build Now** in Jenkins. It will automatically read the `Jenkinsfile` in your code, run the tests, and send the email.

### Method C: Run via GitHub Actions (Cloud Pipeline)
* **How it works:** Microsoft's cloud servers run your tests automatically every time you push code.
* **Setup:**
  1. Go to your repository on GitHub.
  2. Click **Settings** -> **Secrets and variables** -> **Actions**.
  3. Add your `SMTP_USER`, `SMTP_PASS`, and `EMAIL_TO` secrets here so the cloud can send emails.
* **Run:** 
  1. Make a change to your code in VS Code.
  2. Push the code: `git add . && git commit -m "update" && git push origin main`
  3. The pipeline will instantly start running under the **Actions** tab on GitHub!
