// MongoDB initialization script for dating app
db = db.getSiblingDB('dating-app');

// Create a user for the dating app
db.createUser({
  user: 'dating-app-user',
  pwd: 'dating-app-password',
  roles: [
    {
      role: 'readWrite',
      db: 'dating-app'
    }
  ]
});

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'profile'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        profile: {
          bsonType: 'object',
          required: ['firstName', 'lastName', 'age', 'gender', 'interestedIn'],
          properties: {
            age: {
              bsonType: 'int',
              minimum: 18,
              maximum: 100
            }
          }
        }
      }
    }
  }
});

db.createCollection('matches', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['users'],
      properties: {
        users: {
          bsonType: 'array',
          minItems: 2,
          maxItems: 2,
          items: {
            bsonType: 'objectId'
          }
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "profile.location": "2dsphere" });
db.users.createIndex({ "profile.age": 1 });
db.users.createIndex({ "profile.gender": 1 });
db.users.createIndex({ "isProfileComplete": 1 });

db.matches.createIndex({ "users": 1 });
db.matches.createIndex({ "matchedAt": -1 });

// Insert some sample data for testing (optional)
if (db.users.countDocuments() === 0) {
  print('Inserting sample users...');
  
  db.users.insertMany([
    {
      email: 'john.doe@example.com',
      password: '$2a$10$hashedpassword123', // This would be properly hashed
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        gender: 'male',
        interestedIn: ['female'],
        bio: 'Love hiking and coffee! ☕',
        photos: [
          {
            url: 'https://via.placeholder.com/400x600/FF6B6B/FFFFFF?text=John',
            publicId: 'sample1'
          }
        ],
        interests: ['hiking', 'coffee', 'travel'],
        occupation: 'Software Engineer',
        education: 'Bachelor\'s Degree',
        relationshipGoals: 'serious'
      },
      preferences: {
        ageRange: { min: 20, max: 30 },
        maxDistance: 25,
        showMen: false,
        showWomen: true,
        showNonBinary: true
      },
      isProfileComplete: true,
      lastActive: new Date()
    },
    {
      email: 'jane.smith@example.com',
      password: '$2a$10$hashedpassword456', // This would be properly hashed
      profile: {
        firstName: 'Jane',
        lastName: 'Smith',
        age: 23,
        gender: 'female',
        interestedIn: ['male'],
        bio: 'Adventure seeker and book lover 📚',
        photos: [
          {
            url: 'https://via.placeholder.com/400x600/4ECDC4/FFFFFF?text=Jane',
            publicId: 'sample2'
          }
        ],
        interests: ['reading', 'travel', 'yoga'],
        occupation: 'Marketing Specialist',
        education: 'Master\'s Degree',
        relationshipGoals: 'casual'
      },
      preferences: {
        ageRange: { min: 22, max: 28 },
        maxDistance: 30,
        showMen: true,
        showWomen: false,
        showNonBinary: true
      },
      isProfileComplete: true,
      lastActive: new Date()
    }
  ]);
  
  print('Sample users inserted successfully!');
}

print('MongoDB initialization completed successfully!');
