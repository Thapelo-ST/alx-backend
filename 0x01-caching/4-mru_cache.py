#!/usr/bin/env python3
from BaseCaching import BaseCaching
"""
MRUCache inheriting from BaseCaching
"""


class MRUCache(BaseCaching):
    """
    MRUCache inheriting from BaseCaching
    """
    def __init__(self):
        """Initializing the class"""
        super().__init__()

    """
    Assigns the item value to the key in the cache_data dictionary.
    """
    def put(self, key, item):
        """
        Assigns the item value to the key in the cache_data dictionary.
        """
        if key is None or item is None:
            return

        self.cache_data[key] = item

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            discarded_key = max(self.cache_data, key=self.cache_data.get)
            del self.cache_data[discarded_key]
            print("DISCARD: {}".format(discarded_key))

    """
    Returns the value in self.cache_data linked to the provided key.
    """
    def get(self, key):
        """
        Returns the value in self.cache_data linked to the provided key.
        """
        if key is None or key not in self.cache_data:
            return None

        self.cache_data[key] = self.cache_data.pop(key)

        return self.cache_data[key]
