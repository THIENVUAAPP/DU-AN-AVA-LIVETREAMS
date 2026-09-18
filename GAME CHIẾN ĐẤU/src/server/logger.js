function timestamp() {
  return new Date().toISOString();
}

function serializeContext(context) {
  if (!context || Object.keys(context).length === 0) return '';
  try {
    return ' ' + JSON.stringify(context);
  } catch {
    return ' [context không serialize được]';
  }
}

export const logger = {
  info(message, context) {
    console.log(`[${timestamp()}] [INFO] ${message}${serializeContext(context)}`);
  },
  warn(message, context) {
    console.warn(`[${timestamp()}] [WARN] ${message}${serializeContext(context)}`);
  },
  error(message, error, context) {
    const errorInfo = error instanceof Error
      ? { errorMessage: error.message, stack: error.stack }
      : { errorValue: error };
    console.error(`[${timestamp()}] [ERROR] ${message}${serializeContext({ ...context, ...errorInfo })}`);
  },
};
