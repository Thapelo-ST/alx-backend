#!/usr/bin/env python3
"""basic cache class that is inheriting from the base caching class
"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """
    A basic cache class that inherits from the BaseCaching class.
    This class provides a simple LRU (Least Recently Used)
    Cache implementation.
    """
    # cached_data = BaseCaching.cached_data

    """
    assigns dictionary the item value to a key
    """
    def put(self, key, item):
        """
        assigns dictionary the item value to a key
        """
        if key is None and item is None:
            return
        else:
            self.cache_data[key] = item

    """ gets the key 's value from the dictionary based on its key """
    def get(self, key):
        """ gets the key 's value from the dictionary based on its key """
        if key is None or key not in self.cache_data:
            return None
        else:
            return self.cache_data[key]
