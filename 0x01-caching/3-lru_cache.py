#!/usr/bin/env python3
from collections import OrderedDict
from base_caching import BaseCaching
"""LRU inheriting from Base caching"""


class LRUCache(BaseCaching):
    """
    LRUCache inheriting from BaseCaching
    """
    def __init__(self):
        """Initializing the class"""
        super().__init__()
        self.order_dict = OrderedDict()

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
        self.order_dict[key] = None

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            discarded_key, _ = self.order_dict.popitem(last=False)
            del self.cache_data[discarded_key]
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

        self.order_dict.move_to_end(key)

        return self.cache_data[key]
