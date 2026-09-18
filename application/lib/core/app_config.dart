import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'api_client.dart';

// ponytail: hardcoded for the Linux desktop target actually used to run this;
// 10.0.2.2 is Android-emulator-only. Swap for a persisted/editable setting
// if testing on Android (10.0.2.2) or a physical device (LAN IP) later.
final baseUrlProvider = Provider<String>((ref) => 'http://localhost:4000/api/v1');

final apiClientProvider = Provider<ApiClient>((ref) => ApiClient(ref.watch(baseUrlProvider)));
