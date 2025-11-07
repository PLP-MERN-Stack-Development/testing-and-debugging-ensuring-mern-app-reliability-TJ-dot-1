const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Bug = require('../../models/Bug');

describe('Bug API Integration Tests', () => {
  afterEach(async () => {
    await Bug.deleteMany({});
  });

  describe('GET /api/bugs', () => {
    it('should return empty array when no bugs exist', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all bugs', async () => {
      const bug1 = new Bug({
        title: 'Bug 1',
        description: 'Description 1',
        status: 'open'
      });
      const bug2 = new Bug({
        title: 'Bug 2',
        description: 'Description 2',
        status: 'closed'
      });

      await bug1.save();
      await bug2.save();

      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Bug 1');
      expect(response.body[1].title).toBe('Bug 2');
    });
  });

  describe('POST /api/bugs', () => {
    it('should create a new bug successfully', async () => {
      const bugData = {
        title: 'New Bug',
        description: 'This is a new bug',
        status: 'open'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(201);

      expect(response.body.title).toBe('New Bug');
      expect(response.body.description).toBe('This is a new bug');
      expect(response.body.status).toBe('open');
      expect(response.body._id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should create bug with default status when not provided', async () => {
      const bugData = {
        title: 'New Bug',
        description: 'This is a new bug'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(201);

      expect(response.body.status).toBe('open');
    });

    it('should fail validation without title', async () => {
      const bugData = {
        description: 'This is a new bug'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(400);

      expect(response.body.message).toMatch(/title.*required/i);
    });

    it('should fail validation without description', async () => {
      const bugData = {
        title: 'New Bug'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(400);

      expect(response.body.message).toMatch(/description.*required/i);
    });

    it('should fail validation with invalid status', async () => {
      const bugData = {
        title: 'New Bug',
        description: 'This is a new bug',
        status: 'invalid'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(400);

      expect(response.body.message).toMatch(/status.*not.*valid/i);
    });
  });

  describe('PUT /api/bugs/:id', () => {
    let existingBug;

    beforeEach(async () => {
      existingBug = new Bug({
        title: 'Existing Bug',
        description: 'Existing description',
        status: 'open'
      });
      await existingBug.save();
    });

    it('should update bug successfully', async () => {
      const updateData = {
        title: 'Updated Bug',
        description: 'Updated description',
        status: 'closed'
      };

      const response = await request(app)
        .put(`/api/bugs/${existingBug._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe('Updated Bug');
      expect(response.body.description).toBe('Updated description');
      expect(response.body.status).toBe('closed');
    });

    it('should return 404 for non-existent bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = {
        title: 'Updated Bug',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/bugs/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.message).toBe('Bug not found');
    });

    it('should fail validation with invalid status', async () => {
      const updateData = {
        title: 'Updated Bug',
        description: 'Updated description',
        status: 'invalid'
      };

      const response = await request(app)
        .put(`/api/bugs/${existingBug._id}`)
        .send(updateData)
        .expect(400);

      expect(response.body.message).toMatch(/status.*not.*valid/i);
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    let existingBug;

    beforeEach(async () => {
      existingBug = new Bug({
        title: 'Bug to Delete',
        description: 'This bug will be deleted',
        status: 'open'
      });
      await existingBug.save();
    });

    it('should delete bug successfully', async () => {
      const response = await request(app)
        .delete(`/api/bugs/${existingBug._id}`)
        .expect(200);

      expect(response.body.message).toBe('Bug deleted successfully');

      // Verify bug is deleted
      const deletedBug = await Bug.findById(existingBug._id);
      expect(deletedBug).toBeNull();
    });

    it('should return 404 for non-existent bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/bugs/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('Bug not found');
    });
  });
});