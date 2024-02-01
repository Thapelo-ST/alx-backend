#!/usr/bin/env python3
"""LIFO caching class inheriting from BaseCaching class"""
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """LIFO caching class inheriting from BaseCaching class"""

    def __init__(self):
        """initializes the class"""
        super().__init__()

    """ puting the dictionary in the item based on BaseCaching.MAX_ITEMS"""
    def put(self, key, item):
        """ puting the dictionary in the item
        based on BaseCaching.MAX_ITEMS"""
        if key is None or item is None:
            return

        self.cache_data[key] = item

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            discarded_key = list(self.cache_data.keys())[-2]
            del self.cache_data[discarded_key]
            print("DISCARD: {}".format(discarded_key))

    """ getting an item by its key"""
    def get(self, key):
        """getting an item by its key"""
        if key is None or key not in self.cache_data:
            return None
        else:
            return self._dict.get(key)
