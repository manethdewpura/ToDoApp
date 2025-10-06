import { logger } from '../../utils/logger.util.js';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;
  let originalEnv: string | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();

    // Store original NODE_ENV
    originalEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    // Restore console methods
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleDebugSpy.mockRestore();

    // Restore NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });

  describe('info', () => {
    it('should log info message with timestamp and level', () => {
      const message = 'Test info message';
      logger.info(message);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleLogSpy.mock.calls[0];
      expect(logCall[0]).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Test info message/);
      expect(logCall[1]).toBe('');
    });

    it('should log info message with meta data', () => {
      const message = 'Test info message';
      const meta = { userId: 123, action: 'login' };
      logger.info(message, meta);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleLogSpy.mock.calls[0];
      expect(logCall[0]).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Test info message/);
      expect(logCall[1]).toBe(meta);
    });

    it('should handle empty meta data', () => {
      const message = 'Test info message';
      logger.info(message, null);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleLogSpy.mock.calls[0];
      expect(logCall[0]).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Test info message/);
      expect(logCall[1]).toBe('');
    });
  });

  describe('warn', () => {
    it('should log warning message with timestamp and level', () => {
      const message = 'Test warning message';
      logger.warn(message);

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleWarnSpy.mock.calls[0];
      expect(logCall[0]).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[WARN\] Test warning message/);
      expect(logCall[1]).toBe('');
    });

    it('should log warning message with meta data', () => {
      const message = 'Test warning message';
      const meta = { warning: 'deprecated', version: '1.0.0' };
      logger.warn(message, meta);

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleWarnSpy.mock.calls[0];
      expect(logCall[0]).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[WARN\] Test warning message/);
      expect(logCall[1]).toBe(meta);
    });
  });

  describe('error', () => {
    it('should log error message with timestamp and level', () => {
      const message = 'Test error message';
      logger.error(message);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleErrorSpy.mock.calls[0];
      expect(logCall[0]).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[ERROR\] Test error message/);
      expect(logCall[1]).toBe('');
    });

    it('should log error message with meta data', () => {
      const message = 'Test error message';
      const meta = { error: 'Database connection failed', code: 'DB001' };
      logger.error(message, meta);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleErrorSpy.mock.calls[0];
      expect(logCall[0]).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[ERROR\] Test error message/);
      expect(logCall[1]).toBe(meta);
    });

    it('should log error with Error object as meta', () => {
      const message = 'Test error message';
      const error = new Error('Database error');
      logger.error(message, error);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleErrorSpy.mock.calls[0];
      expect(logCall[0]).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[ERROR\] Test error message/);
      expect(logCall[1]).toBe(error);
    });
  });

  describe('debug', () => {
    it('should log debug message in development environment', () => {
      process.env.NODE_ENV = 'development';
      const message = 'Test debug message';
      logger.debug(message);

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleDebugSpy.mock.calls[0];
      expect(logCall[0]).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[DEBUG\] Test debug message/);
      expect(logCall[1]).toBe('');
    });

    it('should not log debug message in production environment', () => {
      process.env.NODE_ENV = 'production';
      const message = 'Test debug message';
      logger.debug(message);

      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should not log debug message in test environment', () => {
      process.env.NODE_ENV = 'test';
      const message = 'Test debug message';
      logger.debug(message);

      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should log debug message with meta data in development', () => {
      process.env.NODE_ENV = 'development';
      const message = 'Test debug message';
      const meta = { debug: 'variable values', step: 3 };
      logger.debug(message, meta);

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleDebugSpy.mock.calls[0];
      expect(logCall[0]).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[DEBUG\] Test debug message/);
      expect(logCall[1]).toBe(meta);
    });

    it('should handle undefined NODE_ENV as non-development', () => {
      delete process.env.NODE_ENV;
      const message = 'Test debug message';
      logger.debug(message);

      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });
  });

  describe('timestamp format', () => {
    it('should use ISO string format for timestamps', () => {
      const message = 'Test message';
      logger.info(message);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const logCall = consoleLogSpy.mock.calls[0];
      const timestampMatch = logCall[0].match(/\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\]/);
      expect(timestampMatch).toBeTruthy();
      
      // Verify it's a valid ISO string
      const timestamp = timestampMatch![1];
      const date = new Date(timestamp);
      expect(date.toISOString()).toBe(timestamp);
    });
  });

  describe('log level formatting', () => {
    it('should format all log levels correctly', () => {
      logger.info('Info message');
      logger.warn('Warn message');
      logger.error('Error message');
      process.env.NODE_ENV = 'development';
      logger.debug('Debug message');

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[INFO\] Info message/),
        ''
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[WARN\] Warn message/),
        ''
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[ERROR\] Error message/),
        ''
      );
      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[DEBUG\] Debug message/),
        ''
      );
    });
  });

  describe('meta data handling', () => {
    it('should handle various meta data types', () => {
      const testCases = [
        { meta: { key: 'value' }, expected: { key: 'value' } },
        { meta: 'string', expected: 'string' },
        { meta: 123, expected: 123 },
        { meta: true, expected: true },
        { meta: null, expected: '' },
        { meta: undefined, expected: '' },
        { meta: [], expected: [] },
        { meta: { nested: { object: true } }, expected: { nested: { object: true } } }
      ];

      testCases.forEach(({ meta, expected }) => {
        jest.clearAllMocks();
        logger.info('Test message', meta);

        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringMatching(/\[INFO\] Test message/),
          expected
        );
      });
    });
  });
});
