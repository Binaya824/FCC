import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/character.dart';
import '../conversations/conversation_list_screen.dart';
import 'character_providers.dart';

class CharacterListScreen extends ConsumerWidget {
  const CharacterListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final charactersAsync = ref.watch(charactersProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Characters')),
      body: charactersAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Failed to load characters: $error')),
        data: (characters) {
          if (characters.isEmpty) {
            return const Center(child: Text('No characters yet — create one via /api-docs.'));
          }
          return ListView.builder(
            itemCount: characters.length,
            itemBuilder: (context, index) {
              final character = characters[index];
              return _CharacterTile(character: character);
            },
          );
        },
      ),
    );
  }
}

class _CharacterTile extends StatelessWidget {
  const _CharacterTile({required this.character});

  final Character character;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        backgroundImage: character.avatar != null ? NetworkImage(character.avatar!) : null,
        child: character.avatar == null ? Text(character.name.substring(0, 1)) : null,
      ),
      title: Text(character.name),
      subtitle: Text(
        character.description,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => ConversationListScreen(character: character)),
        );
      },
    );
  }
}
