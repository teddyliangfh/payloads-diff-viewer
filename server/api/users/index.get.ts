/**
 * Users API endpoint
 * Returns mock user data for demo purposes
 */
export default defineEventHandler(async (event) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      createdAt: '2024-01-02T00:00:00Z',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'user',
      createdAt: '2024-01-03T00:00:00Z',
    },
  ]

  return {
    users,
    total: users.length,
    page: 1,
    limit: 10,
  }
})
