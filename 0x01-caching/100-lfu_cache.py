#!/usr/bin/env python3
"""LFU cache class inheriting from BaseCaching"""
from base_caching import BaseCaching
from collections import defaultdict


class LFUCache(BaseCaching):
    """
    LFUCache inheriting from BaseCaching
    """
    def __init__(self):
        """Initializing the class"""
        super().__init__()
        self.frequency_dict = defaultdict(int)

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
        self.frequency_dict[key] += 1

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            discarded_key = min(self.cache_data, key=lambda k: (
                self.frequency_dict[k], self.order_counter[k]))
            del self.cache_data[discarded_key]
            del self.frequency_dict[discarded_key]
            print("DISCARD: {}\n".format(discarded_key))

    """
    Returns the value in self.cache_data linked to the provided key.
    """
    def get(self, key):
        """
        Returns the value in self.cache_data linked to the provided key.
        """
        if key is None or key not in self.cache_data:
            return None

        self.frequency_dict[key] += 1

        self.cache_data[key] = self.cache_data.pop(key)

        return self.cache_data[key]
