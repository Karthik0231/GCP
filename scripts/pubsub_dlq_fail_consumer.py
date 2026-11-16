"""Deliberately NACK every message for the Pub/Sub DLQ lab."""

import os
import signal
import sys
from concurrent.futures import TimeoutError

from google.cloud import pubsub_v1


PROJECT_ID = os.environ["PROJECT_ID"]
MAIN_SUB = os.environ["MAIN_SUB"]
shutdown = False


def stop(*_args):
    global shutdown
    shutdown = True


def callback(message: pubsub_v1.subscriber.message.Message) -> None:
    print(f"delivery_attempt={message.delivery_attempt} data={message.data!r}", flush=True)
    message.nack()


def main() -> int:
    signal.signal(signal.SIGINT, stop)
    signal.signal(signal.SIGTERM, stop)
    client = pubsub_v1.SubscriberClient()
    subscription = client.subscription_path(PROJECT_ID, MAIN_SUB)
    future = client.subscribe(subscription, callback=callback)
    try:
        while not shutdown:
            try:
                future.result(timeout=5)
            except TimeoutError:
                continue
    except KeyboardInterrupt:
        stop()
    except Exception as exc:
        print(f"subscriber failed: {exc}", file=sys.stderr, flush=True)
        return 1
    finally:
        future.cancel()
        client.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
