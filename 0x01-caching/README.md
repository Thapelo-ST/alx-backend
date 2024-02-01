# Caching

The cache implementations are designed for efficient data storage and retrieval using different replacement policies.

- LRUCache employs the Least Recently Used algorithm, discarding the least recently accessed items when the cache is full.

- In contrast, MRUCache utilizes the Most Recently Used strategy, discarding the most recently accessed items.

- FIFOCache follows the First-In-First-Out policy, evicting the oldest items when the cache reaches its limit.

- LFUCache uses the Least Frequently Used algorithm, discarding the least frequently accessed items, resolving ties with the Least Recently Used method.

Each implementation inherits from BaseCaching and is geared towards optimizing cache performance in diverse scenarios.//------------------------------------------------------------------------------
