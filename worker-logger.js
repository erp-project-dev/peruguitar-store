// worker-logger.js

const COLORS = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
};

let currentIndent = 0;
function indent() {
  return "  ".repeat(currentIndent);
}

const logger = {
  start: (title) => {
    console.info(`\n${COLORS.blue}🚀 ${title} ${COLORS.reset}\n`);
  },

  block: (name, fn) => {
    console.info(`${indent()}${COLORS.gray}📁 ${name}${COLORS.reset}`);
    currentIndent++;

    try {
      fn();
      console.log("\n");
    } catch (err) {
      console.error(err);
    }

    currentIndent--;
  },

  asyncBlock: async (name, fn) => {
    console.info(`${indent()}${COLORS.gray}📁 ${name}${COLORS.reset}`);
    currentIndent++;

    try {
      await fn();
      console.log("\n");
    } catch (err) {
      console.error(`${indent()}${COLORS.red}✖ ${err.message}${COLORS.reset}`);
    }

    currentIndent--;
  },

  info: (msg) => {
    console.info(`${indent()}${msg}`);
  },

  warn: (msg) => {
    console.warn(`${indent()}${COLORS.yellow}⚠ ${msg}${COLORS.reset}`);
  },

  error: (msg) => {
    console.error(`${indent()}${COLORS.red}✖ ${msg}${COLORS.reset}`);
  },

  success: (msg) => {
    console.info(`${indent()}${COLORS.green}✔ ${msg}${COLORS.reset}`);
  },

  end: (title) => {
    console.info(`\n${COLORS.blue}🏁 ${title}.${COLORS.reset}`);
  },
};

export default logger;
