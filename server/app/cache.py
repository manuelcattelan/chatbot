import asyncio


class AsynchronousCache:
    def __init__(self):
        self._cache = {}
        self._lock = asyncio.Lock()

    async def get(self, key):
        await asyncio.sleep(2)

        # This try-except is not needed since getting cached data is mocked
        # by a built-in python dictionary.
        # In a real-world scenario, this could include external services like
        # Redis, thus requiring some kind of error handling.
        try:
            async with self._lock:
                return self._cache.get(key)
        except Exception as e:
            raise Exception(
                f"Failed to get cached answer for key `{key}`: {str(e)}")

    async def set(self, key, value):
        await asyncio.sleep(2)

        # This try-except is not needed since setting cached data is mocked
        # by a built-in python dictionary.
        # In a real-world scenario, this could include external services like
        # Redis, thus requiring some kind of error handling.
        try:
            async with self._lock:
                self._cache[key] = value
                return value
        except Exception as e:
            raise Exception(
                f"Failed to set cached answer for "
                f"key `{key}` and "
                f"value `{value} : {str(e)}")

    async def get_or_set(self, key, value):
        try:
            cache_value = await self.get(key)
            if cache_value is None:
                return await self.set(key, value)
            return cache_value
        except Exception as e:
            raise Exception(e)
