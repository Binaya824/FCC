import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/app_config.dart';
import '../../models/character.dart';
import '../chat/chat_screen.dart';
import 'conversation_providers.dart';

class ConversationListScreen extends ConsumerWidget {
  const ConversationListScreen({required this.character, super.key});

  final Character character;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conversationsAsync = ref.watch(conversationsForCharacterProvider(character.id));

    return Scaffold(
      appBar: AppBar(title: Text(character.name)),
      body: conversationsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Failed to load conversations: $error')),
        data: (conversations) {
          if (conversations.isEmpty) {
            return const Center(child: Text('No conversations yet — start one.'));
          }
          return ListView.builder(
            itemCount: conversations.length,
            itemBuilder: (context, index) {
              final conversation = conversations[index];
              return ListTile(
                title: Text(conversation.title),
                subtitle: Text(_relativeTime(conversation.updatedAt)),
                onTap: () => _openChat(context, conversation.id),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        icon: const Icon(Icons.add),
        label: const Text('New conversation'),
        onPressed: () => _startConversation(context, ref),
      ),
    );
  }

  Future<void> _startConversation(BuildContext context, WidgetRef ref) async {
    try {
      final conversation = await ref.read(apiClientProvider).createConversation(
            characterId: character.id,
            worldId: character.worldId,
          );
      ref.invalidate(conversationsForCharacterProvider(character.id));
      if (context.mounted) _openChat(context, conversation.id);
    } catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$error')));
      }
    }
  }

  void _openChat(BuildContext context, String conversationId) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => ChatScreen(conversationId: conversationId, characterName: character.name),
      ),
    );
  }

  String _relativeTime(DateTime time) {
    final diff = DateTime.now().difference(time);
    if (diff.inMinutes < 1) return 'just now';
    if (diff.inHours < 1) return '${diff.inMinutes}m ago';
    if (diff.inDays < 1) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }
}
