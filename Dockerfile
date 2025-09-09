# Dockerfile for Next.js Application with separate Prisma schema

# STAGE 1: Install dependencies
# Use a specific Node.js version for consistency
FROM node:18-alpine AS deps
WORKDIR /app

# Copy only the package files from the frontend folder
COPY frontend/package.json frontend/package-lock.json ./
# Install dependencies
RUN npm ci


# STAGE 2: Build the application for production
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from the previous stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the entire frontend application source code
COPY frontend ./
# Copy the Prisma schema from the root
COPY prisma/schema.prisma ./prisma/schema.prisma
COPY prisma/seed.ts ./prisma/seed.ts

COPY prisma/migrations ./prisma/migrations

# Generate the Prisma client based on the schema
# This is crucial for the build step to succeed
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build the Next.js application
RUN npm run build


# STAGE 3: Final production image
FROM node:18-alpine AS runner
WORKDIR /app

# Set the environment to production
ENV NODE_ENV production

# Create a non-root user for better security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy only the necessary production artifacts from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Copy the Prisma folder which contains the schema and the generated client
COPY --from=builder /app/prisma ./prisma

# ===================================================================
# THIS IS THE CRITICAL LINE THAT WAS MISSING
# It copies the migration files from your local machine into the final image,
# so the 'prisma migrate deploy' command can find them.
COPY prisma/migrations ./prisma/migrations
# ===================================================================

# Switch to the non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000
ENV PORT 3000

# The command to start the application
CMD ["npm", "start"]    