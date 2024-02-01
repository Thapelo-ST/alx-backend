#!/usr/bin/env python3
"""
FIFO cache inheriting from BaseCaching
"""
from BaseCaching import BaseCaching


class FIFOCache(BaseCaching):
    """
    FIFO cache inheriting from BaseCaching
    """
    def __init__(self):
        """initializing the class"""
        super().__init__()

    """ puting the dictionary in the item based on BaseCaching.MAX_ITEMS"""
    def put(self, key, item):
        """ puting the dictionary in the item
        based on BaseCaching.MAX_ITEMS
        """
        if key is None or item is None:
            return

        self.cache_data[key] = item

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            discarded_key = next(iter(self.cache_data))
            del self.cache_data[discarded_key]
            print("DISCARD: {}".format(discarded_key))

    """ getting an item by its key"""
    def get(self, key):
        """getting an item by its key"""
        if key is None or key not in self.cache_data:
            return None
        else:
            return self._dict.get(key)
