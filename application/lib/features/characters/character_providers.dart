import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/app_config.dart';
import '../../models/character.dart';

final charactersProvider = FutureProvider<List<Character>>((ref) {
  return ref.watch(apiClientProvider).getCharacters();
});
