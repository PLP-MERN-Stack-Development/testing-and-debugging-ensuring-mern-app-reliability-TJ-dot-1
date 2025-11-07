const Bug = require('../../models/Bug');

describe('Bug Model', () => {
  afterEach(async () => {
    await Bug.deleteMany({});
  });

  describe('Schema Validation', () => {
    it('should create a bug with valid data', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'This is a test bug',
        status: 'open'
      };

      const bug = new Bug(bugData);
      const savedBug = await bug.save();

      expect(savedBug.title).toBe('Test Bug');
      expect(savedBug.description).toBe('This is a test bug');
      expect(savedBug.status).toBe('open');
      expect(savedBug.createdAt).toBeDefined();
      expect(savedBug.updatedAt).toBeDefined();
    });

    it('should trim title whitespace', async () => {
      const bugData = {
        title: '  Test Bug  ',
        description: 'This is a test bug'
      };

      const bug = new Bug(bugData);
      const savedBug = await bug.save();

      expect(savedBug.title).toBe('Test Bug');
    });

    it('should fail validation without required title', async () => {
      const bugData = {
        description: 'This is a test bug'
      };

      const bug = new Bug(bugData);
      await expect(bug.save()).rejects.toThrow(/title.*required/i);
    });

    it('should fail validation without required description', async () => {
      const bugData = {
        title: 'Test Bug'
      };

      const bug = new Bug(bugData);
      await expect(bug.save()).rejects.toThrow(/description.*required/i);
    });

    it('should default status to open', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'This is a test bug'
      };

      const bug = new Bug(bugData);
      const savedBug = await bug.save();

      expect(savedBug.status).toBe('open');
    });

    it('should fail validation with invalid status', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'This is a test bug',
        status: 'invalid'
      };

      const bug = new Bug(bugData);
      await expect(bug.save()).rejects.toThrow(/status.*not.*valid/i);
    });

    it('should accept valid status values', async () => {
      const statuses = ['open', 'in-progress', 'closed'];

      for (const status of statuses) {
        const bugData = {
          title: `Test Bug ${status}`,
          description: 'This is a test bug',
          status
        };

        const bug = new Bug(bugData);
        const savedBug = await bug.save();

        expect(savedBug.status).toBe(status);
      }
    });
  });
});