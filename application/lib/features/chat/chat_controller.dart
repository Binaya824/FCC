import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/app_config.dart';
import '../../models/chat_message.dart';

final chatControllerProvider =
    AsyncNotifierProvider.family<ChatController, List<ChatMessage>, String>(
  ChatController.new,
);

class ChatController extends AsyncNotifier<List<ChatMessage>> {
  ChatController(this.conversationId);

  final String conversationId;

  @override
  Future<List<ChatMessage>> build() {
    return ref.read(apiClientProvider).getMessages(conversationId);
  }

  Future<void> send(String text) async {
    final current = state.value ?? [];
    final optimisticUser = ChatMessage(
      id: 'pending-${DateTime.now().microsecondsSinceEpoch}',
      role: MessageRole.user,
      content: text,
      createdAt: DateTime.now(),
    );
    state = AsyncData([...current, optimisticUser]);

    try {
      final reply = await ref.read(apiClientProvider).sendMessage(conversationId, text);
      state = AsyncData([...current, optimisticUser, reply]);
    } catch (error) {
      // Drop the optimistic bubble on failure so the input can be retried cleanly.
      state = AsyncData(current);
      rethrow;
    }
  }
}
