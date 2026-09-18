import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/app_config.dart';
import '../../models/conversation.dart';

final conversationsForCharacterProvider =
    FutureProvider.family<List<Conversation>, String>((ref, characterId) async {
  final all = await ref.watch(apiClientProvider).getConversations();
  return all.where((c) => c.characterId == characterId).toList();
});
