def pytest_itemcollected(item):
    if hasattr(item, 'function'):
        if item.function.__doc__:
            item._nodeid = item.function.__doc__