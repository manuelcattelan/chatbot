import asyncio


class AsynchronousCache:
    def __init__(self):
        self._cache = {}
        self._lock = asyncio.Lock()

    async def get(self, key):
        await asyncio.sleep(2)
        async with self._lock:
            return self._cache.get(key)

    async def set(self, key, value):
        await asyncio.sleep(2)
        async with self._lock:
            self._cache[key] = value
            return value

    async def get_or_set(self, key, value):
        cache_value = await self.get(key)
        if cache_value is None:
            return await self.set(key, value)
        return cache_value
