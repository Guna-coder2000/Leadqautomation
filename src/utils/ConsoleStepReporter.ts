import { Reporter, TestCase, TestResult, TestStep } from '@playwright/test/reporter';

export default class ConsoleStepReporter implements Reporter {
  onStepBegin(test: TestCase, result: TestResult, step: TestStep) {
    if (step.category === 'test.step') {
      console.log(`\n▶ [${test.title}] STEP: ${step.title}`);
    }
  }

  onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
    if (step.category === 'test.step') {
      if (step.error) {
        console.error(`  ❌ FAILED STEP: ${step.title} (${step.duration}ms)`);
        if (step.error.message) {
          console.error(`     Details: ${step.error.message}`);
        }
      } else {
        console.log(`  ✅ PASSED STEP: ${step.title} (${step.duration}ms)`);
      }
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'failed' || result.status === 'timedOut') {
      console.error(`\n================================================================================`);
      console.error(`🚨 AUTOMATION TEST FAILURE DIAGNOSTIC REPORT (CLIENT PROOF)`);
      console.error(`================================================================================`);
      console.error(`Test Title : ${test.title}`);
      console.error(`Spec File  : ${test.location.file} (Line ${test.location.line}, Column ${test.location.column})`);

      const errorMsg = result.error?.message || 'No error message provided';
      const stack = result.error?.stack || '';

      // Extract step execution history
      const testSteps = (result.steps || []).filter(s => s.category === 'test.step');
      const failedStep = testSteps.find(s => s.error !== undefined);
      const failedStepTitle = failedStep ? failedStep.title.toLowerCase() : '';

      // Diagnostic Verdict Classification — mapped to FrameworkError subclasses
      let verdictTitle = '';
      let verdictReason = '';

      if (errorMsg.includes('LocatorError') || errorMsg.includes('was not found in')) {
        verdictTitle = '🚨 SCRIPT / LOCATOR CONFIGURATION ERROR';
        verdictReason = 'The locator or XPath key specified in the page object does not exist or resolved to unexpected elements.';
      } else if (errorMsg.includes('DetachedElementError') || errorMsg.includes('stale') || errorMsg.includes('detached from the DOM')) {
        verdictTitle = '🚨 STALE / DETACHED ELEMENT ERROR';
        verdictReason = 'Element was removed from the DOM between lookup and interaction. Page may have re-rendered.';
      } else if (errorMsg.includes('TargetClosedError') || errorMsg.includes('Target closed')) {
        verdictTitle = '🚨 BROWSER / CONTEXT CLOSED';
        verdictReason = 'Browser tab, context, or browser instance was closed during test execution.';
      } else if (errorMsg.includes('ProtocolError') || errorMsg.includes('CDP')) {
        verdictTitle = '🚨 BROWSER PROTOCOL ERROR';
        verdictReason = 'Chrome DevTools Protocol communication failure. Browser may have crashed.';
      } else if (errorMsg.includes('ExecutionContextDestroyedError') || errorMsg.includes('Execution context was destroyed')) {
        verdictTitle = '🚨 EXECUTION CONTEXT DESTROYED';
        verdictReason = 'JavaScript execution context was destroyed due to page navigation or frame detachment.';
      } else if (errorMsg.includes('FileNotFoundError') || errorMsg.includes('ENOENT')) {
        verdictTitle = '🚨 FILE NOT FOUND ERROR';
        verdictReason = 'A required file (test data, config, or upload) was not found on disk.';
      } else if (errorMsg.includes('JsonParseError') || errorMsg.includes('SyntaxError')) {
        verdictTitle = '🚨 JSON PARSE ERROR';
        verdictReason = 'Failed to parse JSON data file. Check for syntax errors in test data files.';
      } else if (errorMsg.includes('ConfigurationError') || errorMsg.includes('EnvironmentVariableError')) {
        verdictTitle = '🚨 CONFIGURATION / ENVIRONMENT ERROR';
        verdictReason = 'Framework configuration or environment variable is missing or invalid.';
      } else if (
        (failedStepTitle.includes('click') || failedStepTitle.includes('enter') || failedStepTitle.includes('open') || failedStepTitle.includes('navigate') || failedStepTitle.includes('submit')) &&
        (errorMsg.includes('TimeoutError') || errorMsg.includes('Timeout') || errorMsg.includes('exceeded'))
      ) {
        verdictTitle = '⚠️ SCRIPT / ELEMENT LOCATOR TIMEOUT';
        verdictReason = 'Automation script attempted to interact with an element, but the element was not found or not interactable within the configured timeout.';
      } else if (
        failedStepTitle.includes('check') ||
        failedStepTitle.includes('verify') ||
        failedStepTitle.includes('assert') ||
        errorMsg.includes('toBeVisible') ||
        errorMsg.includes('toHaveURL') ||
        errorMsg.includes('CustomAssertionError') ||
        errorMsg.includes('Validation Failure')
      ) {
        verdictTitle = '🐞 CONFIRMED APPLICATION BUG / PRODUCT DEFECT';
        verdictReason = 'User interaction steps completed successfully, but the application failed to produce expected UI behavior, toast message, or page redirect.';
      } else if (errorMsg.includes('NetworkError') || errorMsg.includes('net::')) {
        verdictTitle = '🌐 NETWORK / ENVIRONMENT FAILURE';
        verdictReason = 'Application server or network endpoint failed to respond during test execution.';
      } else {
        verdictTitle = '🐞 APPLICATION / ASSERTION FAILURE';
        verdictReason = 'Test expectation failed during verification phase.';
      }

      console.error(`\n🔍 VERDICT & CONFIDENCE:`);
      console.error(`👉 ${verdictTitle}`);
      console.error(`   Reason: ${verdictReason}`);

      if (testSteps.length > 0) {
        console.error(`\n📋 EXECUTED TEST STEPS HISTORY:`);
        testSteps.forEach((s, idx) => {
          const statusIcon = s.error ? '❌ FAILED' : '✅ PASSED';
          console.error(`   ${idx + 1}. [${statusIcon}] ${s.title}`);
        });
      }

      console.error(`\n💬 EXACT ERROR DETAILS:\n${errorMsg}`);

      if (stack) {
        const relevantLines = stack
          .split('\n')
          .filter(line => !line.includes('node_modules'))
          .slice(0, 10)
          .join('\n');
        console.error(`\n📌 RELEVANT CALL STACK:\n${relevantLines}`);
      }
      console.error(`================================================================================\n`);
    }
  }
}
